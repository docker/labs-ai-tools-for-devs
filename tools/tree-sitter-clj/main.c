#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <tree_sitter/api.h>
#include "tree_sitter/parser.h"

extern const TSLanguage *tree_sitter_markdown(void);
extern const TSLanguage *tree_sitter_python(void);

char *escape_double_quotes(const char *type) {
	char dq[] = "\"";
	int result = strcmp(type, dq);
	if (result == 0) {
		return "\\\"";
	} else {
		return type;
	}
}

// Define a simple key-value pair structure
typedef struct {
    const char *key;
    const TSLanguage *(*language_func)(void);
} LanguageEntry;

// Create the map of TSLanguages
LanguageEntry language_map[] = {
    {"markdown", tree_sitter_markdown},
    {"python", tree_sitter_python},
};

char *escape_back_slash(const char *type) {
	char dq[] = "\\";
	int result = strcmp(type, dq);
	if (result == 0) {
		return "\\\\";
	} else {
		return type;
	}
}

// Function to print an S-expression with line and column information
void print_sexp_with_position(TSNode node, const TSLanguage *lang, const char *source) {
    TSSymbol symbol = ts_node_symbol(node);
    const char *type = ts_language_symbol_name(lang, symbol);

    // Get the start position of the node
    TSPoint start_point = ts_node_start_point(node);

    // Get the end position of the node
    TSPoint end_point = ts_node_end_point(node);

    // Check if the node has a field name
    const char *field_name = ts_node_field_name_for_child(ts_node_parent(node), ts_node_child_index(node));
    if (field_name != null) {
	printf(" %s:", field_name);
    }

    // Print the S-expression with line and column information
    printf("(%s", type);

    printf(" [%d, %d] - [%d, %d]\n", start_point.row, start_point.column, end_point.row, end_point.column);

    // Recursively print child nodes
    for (uint32_t i = 0, child_count = ts_node_child_count(node); i < child_count; i++) {
        TSNode child = ts_node_child(node, i);
        print_sexp_with_position(child, lang, source);
    }

    printf(")");
}

int main(int argc, char *argv[]) {
    // Initialize the Tree-sitter library
    TSParser *parser = ts_parser_new();

    // Default to Markdown if no argument is provided
    const TSLanguage *selected_language = tree_sitter_markdown();
    const char *language_name = "markdown";

    // Check if a language argument is provided
    if (argc > 1) {
        // Look up the language in the language_map
        for (size_t i = 0; i < sizeof(language_map) / sizeof(language_map[0]); i++) {
            if (strcmp(argv[1], language_map[i].key) == 0) {
                selected_language = language_map[i].language_func();
                language_name = language_map[i].key;
                break;
            }
        }
    }

    if (!selected_language) {
        fprintf(stderr, "Error loading %s language\n", language_name);
        return 1;
    }

    // Set the parser's language to the selected language
    ts_parser_set_language(parser, selected_language);

    // Read the Markdown input from a file (change this path to your Markdown file)
    /*FILE *input_file = fopen(argv[1], "r");*/
    /*if (!input_file) {*/
        /*fprintf(stderr, "Error opening input file\n");*/
        /*return 1;*/
    /*}*/

    // Get the size of the input file
    /*fseek(input_file, 0, SEEK_END);*/
    /*long file_size = ftell(input_file);*/
    /*rewind(input_file);*/

    // Read the file content into a buffer
    /*char *input_buffer = (char *)malloc(file_size + 1);*/
    /*fread(input_buffer, 1, file_size, input_file);*/

    char *input_buffer = NULL;
    size_t buffer_size = 0;
    size_t file_size = 0;

    while (1) {
        char chunk[1024]; // Read data in 1KB chunks

        // Read a chunk of data from stdin
        size_t bytes_read = fread(chunk, 1, sizeof(chunk), stdin);

        if (bytes_read == 0) {
            // No more data to read (EOF or error)
            break;
        }

        // Resize the buffer to accommodate the new data
        file_size += bytes_read;
        input_buffer = (char *)realloc(input_buffer, file_size);

        if (input_buffer == NULL) {
            perror("Memory allocation failed");
            exit(EXIT_FAILURE);
        }

        // Copy the chunk into the buffer
        memcpy(input_buffer + file_size - bytes_read, chunk, bytes_read);
    }

    input_buffer[file_size] = '\0';

    // Create a Tree-sitter input document
    // TSInput input = ts_input_from_string(input_buffer);

    // Parse the input
    TSTree *tree = ts_parser_parse_string(parser, NULL, input_buffer, file_size);

    TSNode root_node = ts_tree_root_node(tree);

    // Check if parsing was successful
    if (ts_node_is_null(root_node)) {
        fprintf(stderr, "Parsing failed\n");
        return 1;
    }

    // Perform your desired operations with the parsed tree here
    // For example, you can traverse the tree and analyze the Markdown document's structure.
    //const char *root_string = tsc_node_string(root_node);
    //printf("%s", root_string);

    print_sexp_with_position(root_node, selected_language, input_buffer);
    // Clean up resources
    ts_parser_delete(parser);
    //fclose(input_file);
    free(input_buffer);

    return 0;
}

