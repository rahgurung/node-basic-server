const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((request, response) => {

    // Build file path
    let filePath = path.join(
        __dirname,
        "views",
        request.url === "/" ? "index.html" : request.url
    )

    // Extension of file
    let extname = path.extname(filePath);

    // Initial content type
    let contentType = "text/html";

    // Check extension and set content type
    switch(extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;    
    }

    // Check if contenType is text/html but no .html file extension
    if (contentType == "text/html" && extname == "") {
        filePath += ".html";
    }

    // Log the filePath
    console.log(filePath);

    // Read file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == "ENOENT") {
                // Page not found :(
                fs.readFile(
                    path.join(__dirname, "public", "404.html"),
                    (error, content) => {
                        response.writeHead(200, { "Content-Type": "text/html" });
                        response.end(content, "utf8");
                    }
                );
            } else {
                //  Some server error
                response.writeHead(500);
                response.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf8");
        }
    });
});

const PORT = 8100;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
