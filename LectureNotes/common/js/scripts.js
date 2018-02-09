$(function() {
    let self = this;
    let source = document.getElementsByTagName('html')[0].innerHTML;

    // encode html characters inside of code tags
    source = source.replace(/<code>((.|\n|\r\n)*?)<\/code>/g, (match, p1) => {
        p1 = safe_tags_replace(p1);
        console.log(p1);
        return `<code>${p1}</code>`;
    });
    // todo - make this more efficient (currently rewrites whole DOM)
    document.getElementsByTagName('html')[0].innerHTML = source;

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

    source = document.getElementsByTagName('html')[0].innerHTML;
    // add support for md style links
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
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    // add links to resources
    let res = $("#resources");
    $("a").not(".link-internal").each((index, el) => {
        let ell = $(el);
        let link = ell.attr('href');

        if (!link) {
            return;
        }

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

    // make links open in new tab
    $("a").not(".link-internal").attr("target", "_blank");


    // utility stuff


    function replaceTag(tag) {
        const tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        console.log('tag', tag)
        return tagsToReplace[tag] || tag;
    }

    function safe_tags_replace(str) {
        return str.replace(/[&<>]/g, replaceTag);
    }
});