package tostring

import (
	"encoding/json"
	"fmt"
	"strings"

	contenttree "github.com/Financial-Times/content-tree"
)

var separate = []string{contenttree.HeadingType, contenttree.ParagraphType}

// Transform receives a content-tree as unmarshalled JSON([]byte) and returns the plain text from the content-tree.
func Transform(root json.RawMessage) (string, error) {
	tree := contenttree.Root{}

	err := json.Unmarshal(root, &tree)
	if err != nil {
		return "", fmt.Errorf("failed to parse string to content tree: %w", err)
	}

	s, err := transformNode(&tree)
	return strings.TrimSpace(dedupWhitespace(s)), err
}

func transformNode(n contenttree.Node) (string, error) {
	if n.GetType() == contenttree.RootType {
		root, ok := n.(*contenttree.Root)
		if !ok {
			return "", fmt.Errorf("failed to parse node to root")
		}

		return transformNode(root.Body)
	}

	switch n.GetType() {
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

	if n.GetType() == contenttree.TextType {
		text, ok := n.(*contenttree.Text)
		if !ok {
			return "", fmt.Errorf("failed to parse node to text")
		}

		return text.Value, nil
	}

	childrenNodes := n.GetChildren()
	if childrenNodes != nil {
		children := []string{}
		for _, child := range childrenNodes {
			s, err := transformNode(child)
			if err != nil {
				return "", fmt.Errorf("failed to transform child node to string: %w", err)
			}

			children = append(children, s)
		}

		childrenStr := strings.Join(children, "")

		if contains(separate, n.GetType()) && len(childrenStr) > 0 {
			childrenStr += " "
		}

		return childrenStr, nil
	}

	return "", nil
}

func dedupWhitespace(s string) string {
	return strings.Join(strings.Fields(s), " ")
}

func contains(arr []string, val string) bool {
	for _, s := range arr {
		if s == val {
			return true
		}
	}
	return false
}
