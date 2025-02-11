package tostring

import (
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strings"

	contenttree "github.com/Financial-Times/content-tree"
)

var toSeparate = []string{contenttree.HeadingType, contenttree.ParagraphType}

// Transform extracts and returns plain text from a content tree represented as unmarshalled JSON(json.RawMessage).
func Transform(root json.RawMessage) (string, error) {
	tree := contenttree.Root{}

	err := json.Unmarshal(root, &tree)
	if err != nil {
		return "", fmt.Errorf("failed to instantiate content tree: %w", err)
	}

	text, err := transformNode(&tree)
	if err != nil {
		return "", fmt.Errorf("failed to transform tree to string: %w", err)
	}

	// Deduplicate whitespace.
	text = strings.Join(strings.Fields(text), " ")

	// Trim leading and trailing whitespace.
	text = strings.TrimSpace(text)

	return text, nil
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
			return "", errors.New("failed to parse node to text")
		}

		return text.Value, nil
	}

	childrenNodes := n.GetChildren()
	if len(childrenNodes) == 0 {
		return "", nil
	}

	childrenStrs := []string{}
	for _, child := range childrenNodes {
		s, err := transformNode(child)
		if err != nil {
			return "", fmt.Errorf("failed to transform child node to string: %w", err)
		}

		childrenStrs = append(childrenStrs, s)
	}

	result := strings.Join(childrenStrs, "")

	if slices.Contains(toSeparate, n.GetType()) && len(result) > 0 {
		result += " "
	}

	return result, nil
}
