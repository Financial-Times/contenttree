package toexternalbodyxml

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	contenttree "github.com/Financial-Times/content-tree"
)

// Transform converts content from the content tree format, provided as unmarshalled JSON (json.RawMessage),
// into an "external" XHTML-formatted version of the same content.
//
// The XHTML output is intended for distribution to consumers that only support widely recognized formats like HTML
// or those that should not receive internal-specific details contained in the content tree format.
// Such consumers may be external (non-FT) users, automated systems processing HTML-based content,
// republishing platforms, and more.
func Transform(root json.RawMessage) (string, error) {
	tree := contenttree.Root{}

	err := json.Unmarshal(root, &tree)
	if err != nil {
		return "", fmt.Errorf("failed to instantiate content tree: %w", err)
	}

	return transformNode(&tree)
}

func transformNode(n contenttree.Node) (string, error) {
	if n == nil {
		return "", errors.New("nil node")
	}

	if n.GetType() == contenttree.RootType {
		root, ok := n.(*contenttree.Root)
		if !ok {
			return "", errors.New("failed to parse node to root")
		}

		return transformNode(root.Body)
	}

	innerXML := ""

	childrenNodes := n.GetChildren()
	if childrenNodes != nil {
		childrenStr := make([]string, 0, len(childrenNodes))
		for _, child := range childrenNodes {
			s, err := transformNode(child)
			if err != nil {
				return "", fmt.Errorf("failed to transform child node to external XML: %w", err)
			}

			childrenStr = append(childrenStr, s)
		}
		innerXML = strings.Join(childrenStr, "")
	}

	switch node := n.(type) {
	case *contenttree.Body:
		return fmt.Sprintf("<body>%s</body>", innerXML), nil

	case *contenttree.Text:
		return node.Value, nil

	case *contenttree.Break:
		return "<br>", nil

	case *contenttree.ThematicBreak:
		return "<hr>", nil

	case *contenttree.Paragraph:
		return fmt.Sprintf("<p>%s</p>", innerXML), nil

	case *contenttree.Heading:
		tag := ""
		if node.Level == "chapter" {
			tag = "h1"
		}
		if node.Level == "subheading" {
			tag = "h2"
		}
		if node.Level == "label" {
			tag = "h4"
		}
		if tag == "" {
			return "", fmt.Errorf("failed to transform heading with level %s", node.Level)
		}
		return fmt.Sprintf("<%[1]s>%s</%[1]s>", tag, innerXML), nil

	case *contenttree.Strong:
		return fmt.Sprintf("<strong>%s</strong>", innerXML), nil

	case *contenttree.Emphasis:
		return fmt.Sprintf("<em>%s</em>", innerXML), nil

	case *contenttree.Strikethrough:
		return fmt.Sprintf("<s>%s</s>", innerXML), nil

	case *contenttree.Link:
		// TODO: Different types of links needs to be handled, including anchors, this implementation is a placeholder
		// which handles only a link to an FT article. It seems that the content tree link object at the moment does not
		// provide enough information to distinguish between different types of links.
		parts := strings.Split(node.URL, "/")
		return fmt.Sprintf("<ft-content type=\"http://www.ft.com/ontology/content/Article\" url=\"http://api.ft.com/content/%s\">%s</ftcontent>", parts[len(parts)-1], innerXML), nil

	case *contenttree.List:
		tag := "ul"
		if node.Ordered {
			tag = "ol"
		}
		return fmt.Sprintf("<%[1]s>%s</%[1]s>", tag, innerXML), nil

	case *contenttree.ListItem:
		return fmt.Sprintf("<li>%s</li>", innerXML), nil

	case *contenttree.Blockquote:
		return fmt.Sprintf("<blockquote>%s</blockquote>", innerXML), nil

	case *contenttree.Pullquote:
		// TODO: The <pull-quote> tag is not a standard HTML tag, it is a custom tag used by the FT. It is worth to
		// reconsider whether external consumers should receive this tag or it should be transformed into a standard HTML.
		return fmt.Sprintf("<pull-quote><pull-quote-text><p>%s</p></pull-quote-text><pull-quote-source>%s</pull-quote-source></pull-quote>", node.Text, node.Source), nil

	case *contenttree.ImageSet:
		return fmt.Sprintf("<content data-embedded=\"true\" id=\"%s\" type=\"http://www.ft.com/ontology/content/ImageSet\"></content>", node.ID), nil

	// TODO: The current content tree definition does include Flourish nodes but the JSON schemas does not.
	// case *contenttree.Flourish:
	// 	return "", nil

	// TODO:
	case *contenttree.TableCaption:
		return "", nil
	case *contenttree.TableCell:
		return "", nil
	case *contenttree.TableRow:
		return "", nil
	case *contenttree.TableBody:
		return "", nil
	case *contenttree.TableFooter:
		return "", nil
	case *contenttree.Table:
		return "", nil
	case *contenttree.Video:
		return "", nil
	case *contenttree.YoutubeVideo:
		return "", nil
	case *contenttree.ScrollyBlock:
		return "", nil
	case *contenttree.ScrollySection:
		return "", nil
	case *contenttree.ScrollyImage:
		return "", nil
	case *contenttree.ScrollyCopy:
		return "", nil
	case *contenttree.ScrollyHeading:
		return "", nil

	// content tree nodes that were published inside experimental tag and as such are not supported in the "external"
	// body XML format
	case *contenttree.Layout:
		return "", nil
	case *contenttree.LayoutSlot:
		return "", nil
	case *contenttree.LayoutImage:
		return "", nil

	// content tree nodes that were published as custom XML tags and are not supported in the "external" body XML format
	case *contenttree.Recommended:
		return "", nil

	case *contenttree.Tweet:
		return "", nil

	case *contenttree.BigNumber:
		return "", nil

	case *contenttree.CustomCodeComponent:
		return "", nil

	// content tree nodes which require transformation of their embedded nodes
	case *contenttree.BodyBlock:
		return transformNode(n.GetEmbedded())
	case *contenttree.BlockquoteChild:
		return transformNode(n.GetEmbedded())
	case *contenttree.LayoutChild:
		return transformNode(n.GetEmbedded())
	case *contenttree.LayoutSlotChild:
		return transformNode(n.GetEmbedded())
	case *contenttree.ListItemChild:
		return transformNode(n.GetEmbedded())
	case *contenttree.Phrasing:
		return transformNode(n.GetEmbedded())
	case *contenttree.ScrollyCopyChild:
		return transformNode(n.GetEmbedded())
	case *contenttree.ScrollySectionChild:
		return transformNode(n.GetEmbedded())
	case *contenttree.TableChild:
		return transformNode(n.GetEmbedded())
	}

	return "", nil
}
