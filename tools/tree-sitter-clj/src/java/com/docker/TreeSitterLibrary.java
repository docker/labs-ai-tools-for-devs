package com.docker;

import com.sun.jna.*;
import com.sun.jna.ptr.PointerByReference;

public interface TreeSitterLibrary extends Library {
    TreeSitterLibrary INSTANCE = Native.load("tree-sitter", TreeSitterLibrary.class);

    // Structures
    @Structure.FieldOrder({"row", "column"})
    class TSPoint extends Structure {
        public int row;
        public int column;
    }

    // Opaque types
    class TSParser extends PointerType {}
    class TSTree extends PointerType {}
    class TSNode extends PointerType {}
    class TSLanguage extends PointerType {}

    // Functions
    TSParser ts_parser_new();
    void ts_parser_delete(TSParser parser);
    boolean ts_parser_set_language(TSParser parser, TSLanguage language);
    TSTree ts_parser_parse_string(TSParser parser, TSTree old_tree, Memory string, int length);
    TSTree ts_parser_parse_string_encoding(TSParser parser, TSTree old_tree, Memory string, int length, int t);
    TSNode ts_tree_root_node(TSTree tree);
    boolean ts_node_is_null(TSNode node);
    String ts_node_type(TSNode node);
    TSPoint ts_node_start_point(TSNode node);
    TSPoint ts_node_end_point(TSNode node);
    int ts_node_child_count(TSNode node);
    TSNode ts_node_child(TSNode node, int index);
    String ts_node_string(TSNode node);
    // Add more functions as needed
}
