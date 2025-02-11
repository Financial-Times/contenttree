package toexternalbodyxml

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestTransform(t *testing.T) {
	for _, test := range getTestCases(t) {
		t.Run(test.name, func(t *testing.T) {
			got, err := Transform(test.input)

			if err != nil && !test.wantErr {
				t.Errorf("Failed with unexpected error: %v", err)
			}
			if err != nil && test.wantErr {
				return
			}

			if got != strings.TrimSpace(test.output) {
				t.Errorf("got: %s\n\n want: %s\n", got, test.output)
			}
		})
	}
}

type TestCase struct {
	name    string
	input   json.RawMessage
	output  string
	wantErr bool
}

func getTestCases(t *testing.T) []TestCase {
	t.Helper()

	inputPath := "../../../tests/content-tree-to-external-bodyxml/input"
	outputPath := "../../../tests/content-tree-to-external-bodyxml/output"

	entries, err := os.ReadDir(inputPath)
	if err != nil {
		t.Fatal(err)
	}

	testCases := make([]TestCase, 0, len(entries))

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		inputFile := filepath.Join(inputPath, entry.Name())

		input, err := os.ReadFile(inputFile)
		if err != nil {
			t.Fatalf("Failed to read file %s: %s", inputFile, err)
		}

		caseName := strings.TrimSuffix(entry.Name(), filepath.Ext(entry.Name()))
		outputFile := filepath.Join(outputPath, caseName+".xml")

		if _, err := os.Stat(outputFile); errors.Is(err, os.ErrNotExist) {
			testCases = append(testCases, TestCase{
				name:    caseName,
				input:   input,
				output:  "",
				wantErr: true,
			})
		} else {
			output, err := os.ReadFile(outputFile)
			if err != nil {
				t.Fatalf("Failed to read file %s: %s", outputFile, err)
			}

			testCases = append(testCases, TestCase{
				name:    caseName,
				input:   input,
				output:  string(output),
				wantErr: false,
			})
		}
	}

	return testCases
}
