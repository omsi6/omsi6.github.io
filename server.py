#!/usr/bin/env python3

import http.server
import socketserver

HOST = "localhost"
PORT = 8080


class HttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        "": "application/octet-stream",
        ".css": "text/css",
        ".html": "text/html",
        ".jpg": "image/jpg",
        ".js": "application/x-javascript",
        ".json": "application/json",
        ".manifest": "text/cache-manifest",
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".wasm": "application/wasm",
        ".xml": "application/xml",
    }


try:
    with socketserver.TCPServer((HOST, PORT), HttpRequestHandler) as httpd:
        print(f"serving at http://{HOST}:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    pass