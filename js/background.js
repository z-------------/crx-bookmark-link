var xhr = function(url, callback) {
    var req = new XMLHttpRequest();
    req.onload = function() {
        var response = this.responseText;
        callback(response);
    };
    req.open("get", url, true);
    req.send();
};

chrome.contextMenus.create({
    title: "Bookmark this link",
    contexts: [ "link" ]
}, function() {
    console.log("created context menu item");
});

chrome.contextMenus.onClicked.addListener(function(info) {
    if (info.linkUrl) {
        xhr(info.linkUrl, function(responseText) {
            if (responseText) {
                var title, description,
                    url = info.linkUrl;

                var responseDoc = document.createElement("html");
                responseDoc.innerHTML = responseText;

                var titleElem = responseDoc.querySelector("title");
                var descriptionElem = responseDoc.querySelector("meta[name='description']");

                title = titleElem.textContent || "(untitled)";
                description = descriptionElem ? descriptionElem.getAttribute("content") : "";

                chrome.bookmarks.create({
                    title: title,
                    url: url
                }, function() {
                    console.log("added bookmark %s %s", title, url);
                });
            }
        });
    }
});

console.log("crx-bookmark-link background.js running");
