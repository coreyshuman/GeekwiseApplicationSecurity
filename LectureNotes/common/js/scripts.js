// make links open in new tab
$("a").attr("target", "_blank");
// generate table of contents
let toc = $("#table-of-contents");
if (toc.length) {
    $(":header").each((index, el) => {
        let ell = $(el);
        let headText = ell.text();
        let indent = ell[0].localName.substring(1);

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
            .text(headText)
            .attr('href', '#' + headText)
            .appendTo(li);
    });
}