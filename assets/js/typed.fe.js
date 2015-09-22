(function( $ ) {
  $( document ).ready( function() {
    $( '.typed-me' ).each( function() {
      var options = {}, strings = [];
      for( var key in this.dataset ) {
        if( key.substr( 0, 6 ) == "string" ) {
          strings.push( this.dataset[ key ] );
        } else {
          options[ key ] = parseInt( this.dataset[ key ] );
        }
      }

      options[ 'strings' ] = strings;
      options[ 'contentType' ] = 'html';

      $( this ).typed( options );
    });
  });
})(jQuery);
