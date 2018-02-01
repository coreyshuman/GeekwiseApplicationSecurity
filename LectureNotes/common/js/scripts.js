$(function() {


    // add links to resources
    let res = $("#resources");
    $("a").each((index, el) => {
        let ell = $(el);
        let link = ell.attr('href');

        let blacklist = [
            "localhost",
            "192.168.99.100",
            "coreyshuman",
            "geekwise",
            "slack"
        ];

        for (let i = 0; i < blacklist.length; i++) {
            if (link.indexOf(blacklist[i]) >= 0) {
                return;
            }
        }

        var li = $('<li/>')
            .addClass('ui-list-0')
            .appendTo(res);
        var a = $('<a/>')
            .addClass('ui-link')
            .text(link)
            .attr('href', link)
            .appendTo(li);
    });

    // generate table of contents
    let toc = $("#table-of-contents");
    if (toc.length) {
        $(":header").each((index, el) => {
            let ell = $(el);
            let headText = ell.text();
            let indent = ell[0].localName.substring(1);

            if (indent > 3) {
                return;
            }

            var anc = $('<a/>')
                .addClass('ui-anchor')
                .attr('name', headText)

            ell.before($('<br>'));
            ell.before(anc);

            var li = $('<li/>')
                .addClass('ui-list-' + indent)
                .appendTo(toc);
            var a = $('<a/>')
                .addClass('ui-link')
                .addClass('link-internal')
                .text(headText)
                .attr('href', '#' + headText)
                .appendTo(li);
        });
    }
    // add support for md style links
    let source = document.getElementsByTagName('html')[0].innerHTML;
    source = source.replace(/\[(.*?)]\((https?.*?)\)/g, (match, p1, p2) => {
        return `<a href="${p2}">${p1}</a>`;
    });
    // custom simple internal link format
    source = source.replace(/\[\[(.*?)]\]/g, (match, p1) => {
        let found = source.indexOf(`#${p1}`);
        let result = "";
        if (found < 0) {
            result = `<a class="link-internal broken-link" href="#${p1}">${p1}</a>`;
        } else {
            result = `<a class="link-internal" href="#${p1}">${p1}</a>`;
        }
        return result;
    });

    // todo - make this more efficient (currently rewrites whole DOM)
    document.getElementsByTagName('html')[0].innerHTML = source;


    // make links open in new tab
    $("a").not(".link-internal").attr("target", "_blank");
});