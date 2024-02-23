package toexternalbodyxml

import (
	"encoding/json"
	"fmt"
	"strings"

	contenttree "github.com/Financial-Times/content-tree"
)

const ParseFailedStr = "failed to parse node to %s"

// Transform receives a content-tree as unmarshalled JSON([]byte) and returns its body XML representation
// distributed to external(non-FT) consumers of the content.
func Transform(root json.RawMessage) (string, error) {
	tree := contenttree.Root{}

	err := json.Unmarshal(root, &tree)
	if err != nil {
		return "", fmt.Errorf("failed to parse string to content tree: %w", err)
	}

	return transformNode(&tree)
}

func transformNode(n contenttree.Node) (string, error) {
	innerXML := ""

	if n.GetType() == contenttree.RootType {
		root, ok := n.(*contenttree.Root)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.RootType)
		}

		return transformNode(root.Body)
	}

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

	switch n.GetType() {
	case contenttree.BodyType:
		return fmt.Sprintf("<body>%s</body>", innerXML), nil

	case contenttree.TextType:
		text, ok := n.(*contenttree.Text)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.TextType)
		}
		return text.Value, nil

	case contenttree.BreakType:
		return "", nil

	case contenttree.ThematicBreakType:
		return "", nil

	case contenttree.ParagraphType:
		return fmt.Sprintf("<p>%s</p>", innerXML), nil

	case contenttree.HeadingType:
		heading, ok := n.(*contenttree.Heading)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.HeadingType)
		}
		tag := ""
		if heading.Level == "chapter" {
			tag = "h1"
		}
		if heading.Level == "subheading" {
			tag = "h2"
		}
		if heading.Level == "label" {
			tag = "h4"
		}
		if tag == "" {
			return "", fmt.Errorf("failed to transform %s with level %s", contenttree.HeadingType, heading.Level)
		}
		return fmt.Sprintf("<%[1]s>%s</%[1]s>", tag, innerXML), nil

	case contenttree.StrongType:
		return fmt.Sprintf("<strong>%s</strong>", innerXML), nil

	case contenttree.EmphasisType:
		return fmt.Sprintf("<em>%s</em>", innerXML), nil

	case contenttree.StrikethroughType:
		return fmt.Sprintf("<s>%s</s>", innerXML), nil

	case contenttree.LinkType:
		link, ok := n.(*contenttree.Link)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.LinkType)
		}
		parts := strings.Split(link.URL, "/")
		return fmt.Sprintf("<content id=\"%s\" type=\"http://www.ft.com/ontology/content/Article\">%s</content>", parts[len(parts)-1], innerXML), nil

	case contenttree.ListType:
		list, ok := n.(*contenttree.List)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.ListType)
		}
		tag := "ul"
		if list.Ordered {
			tag = "ol"
		}
		return fmt.Sprintf("<%[1]s>%s</%[1]s>", tag, innerXML), nil

	case contenttree.ListItemType:
		return fmt.Sprintf("<li>%s</li>", innerXML), nil

	case contenttree.BlockquoteType:
		return fmt.Sprintf("<blockquote>%s</blockquote>", innerXML), nil

	case contenttree.PullquoteType:
		pullQuote, ok := n.(*contenttree.Pullquote)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.Pullquote{})
		}
		return fmt.Sprintf("<pull-quote>\n<pull-quote-text><p>%s</p></pull-quote-text><pull-quote-source>%s</pull-quote-source>\n</pull-quote>", pullQuote.Text, pullQuote.Source), nil

	case contenttree.ImageSetType:
		imageSet, ok := n.(*contenttree.ImageSet)
		if !ok {
			return "", fmt.Errorf(ParseFailedStr, contenttree.ImageSetType)
		}
		return fmt.Sprintf("<content data-embedded=\"true\" id=\"%s\" type=\"http://www.ft.com/ontology/content/ImageSet\"></content>", imageSet.ID), nil

	case contenttree.RecommendedType:
		return "", nil

	case contenttree.TweetType:
		return "", nil
	case contenttree.FlourishType:
		return "", nil
	case contenttree.BigNumberType:
		return "", nil
	case contenttree.VideoType:
		return "", nil
	case contenttree.YoutubeVideoType:
		return "", nil
	case contenttree.ScrollyBlockType:
		return "", nil
	case contenttree.ScrollySectionType:
		return "", nil
	case contenttree.ScrollyImageType:
		return "", nil
	case contenttree.ScrollyCopyType:
		return "", nil
	case contenttree.ScrollyHeadingType:
		return "", nil
	case contenttree.LayoutType:
		return "", nil
	case contenttree.LayoutSlotType:
		return "", nil
	case contenttree.LayoutImageType:
		return "", nil
	case contenttree.TableCaptionType:
		return "", nil
	case contenttree.TableCellType:
		return "", nil
	case contenttree.TableRowType:
		return "", nil
	case contenttree.TableBodyType:
		return "", nil
	case contenttree.TableFooterType:
		return "", nil
	case contenttree.TableType:
		return "", nil

	case contenttree.BodyBlockType:
		return transformNode(n.GetEmbedded())
	case contenttree.BlockquoteChildType:
		return transformNode(n.GetEmbedded())
	case contenttree.LayoutChildType:
		return transformNode(n.GetEmbedded())
	case contenttree.LayoutSlotChildType:
		return transformNode(n.GetEmbedded())
	case contenttree.ListItemChildType:
		return transformNode(n.GetEmbedded())
	case contenttree.PhrasingType:
		return transformNode(n.GetEmbedded())
	case contenttree.ScrollyCopyChildType:
		return transformNode(n.GetEmbedded())
	case contenttree.ScrollySectionChildType:
		return transformNode(n.GetEmbedded())
	case contenttree.TableChildType:
		return transformNode(n.GetEmbedded())
	}

	return "", nil
}
