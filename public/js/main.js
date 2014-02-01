$(function() {
    var $alert = $('.alert');
    $alert.hide();

    $('.post-delete').click(function(event) {
        var doDelete = confirm('Really?');
        if (doDelete === false) {
            return;
        }
        $target = $(event.target);
        $.ajax({
            type: 'DELETE',
            url: '/' + $target.attr('data-post-id'),
            data: {
                _csrf: $target.attr('data-csrf')
            },
            success: function(response) {
                $alert.trigger('success', 'Task was removed.');
                $('#' + $target.attr('data-post-id').toString()).detach();
            },
            error: function(error) {
                $alert.trigger('error', error);
            }
        })
    });
});
