﻿// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name data-min.js
// @externs function $(arg) {};
// ==/ClosureCompiler==

(function () {

    // Wait for jQuery to load
    var wait_for_jquery_treeview = function (fn) {
        while ((typeof($) !== 'function') || !($() && $()['jquery'] && $()['treeview'])) {
            setTimeout(function () { wait_for_jquery_treeview(fn); }, 10);
            return;
        }
        fn();
    };

    var longmonth = function (abbr) {
        switch (abbr) {
            case 'Jan':
                return 'January';
            case 'Feb':
                return 'February';
            case 'Mar':
                return 'March';
            case 'Apr':
                return 'April';
            case 'May':
                return 'May';
            case 'Jun':
                return 'June';
            case 'Jul':
                return 'July';
            case 'Aug':
                return 'August';
            case 'Sep':
                return 'September';
            case 'Oct':
                return 'October';
            case 'Nov':
                return 'November';
            case 'Dec':
                return 'December';
        }
    };

    var load_json_data = function () {
        $.get('/data.html', process_json_data);
    }

    var process_json_data = function (data) {
        var data = eval('(' + data + ')'),
            ul = $('<ul/>', { 'class': 'j_archive_list treeview' });

        for (var i in data) if (data.hasOwnProperty(i)) {
            // Append each year to the list
            var year = data[i].date.slice(26, 30);
            if (!(ul.children('.j_year_' + year)[0])) {
                ul.append($('<li/>', { 'class': 'j_year_' + year })
                  .append($('<span/>', { 'class': 'folder' }).text(year))
                );
            }
            // Append each month to the list
            var month = longmonth(data[i].date.slice(4, 7));
            if (!(ul.children('.j_year_' + year).find('.j_month_' + month.toLowerCase())[0])) {
                if (!(ul.children('.j_year_' + year).find('.j_months')[0])) {
                    ul.children('.j_year_' + year).append($('<ul/>', { 'class': 'j_months' }));
                }
                ul.children('.j_year_' + year)
                  .find('.j_months')
                  .append($('<li/>', { 'class': 'j_month_' + month.toLowerCase() })
                    .append($('<span/>', { 'class': 'folder' }).text(month))
                    .append($('<ul/>', { 'class': 'j_posts' }))
                  );
            }
            // Append each post to the list
            ul.children('.j_year_' + year)
              .find('.j_months')
              .find('.j_month_' + month.toLowerCase())
              .find('.j_posts')
              .append($('<li/>', { 'class': 'post j_post' })
                .append($('<a/>', { href: data[i].url, 'class': 'file' }).text(data[i].title))
              );
        }
        // Set up the tree view
        $('.j_archives').append(ul).find('.j_loader').remove();
        ul.treeview({
            animated: 'fast',
            collapsed: true
        });
        // Expand the first month
        $('.j_archive_list span:first').click().parent().find('ul li:first span').click()
    };

    // Load archives when jQuery is ready
    wait_for_jquery_treeview(function () {
        $(load_json_data);
    });

})();