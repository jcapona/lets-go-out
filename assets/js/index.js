$(document).ready(function(){
  
  // Cookie management
  // http://www.quirksmode.org/js/cookies.html
  function createCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name,"",-1);
  }


  /**
    Restores search & selection if user tries to go to a place while not logged in
  */
  if((readCookie('login-restore') !== null))
  {
      $("#header").addClass("hidden");
      $("#search-results").html('<div class="text-center"><i class="fa fa-circle-o-notch fa-spin fa-5x"></i></div>');

      // Restore search
      $.ajax({
        url: '/event/search',
        type: 'GET',
        data: readCookie('query'),
        error: function(jqXHR, textStatus, errorThrown) {
          $("#search-results").html('');
          $("#search-results").append("<h4 class='text-center'>Error: "+jqXHR['responseJSON']['message']['source']['text']+" :(</h4>");
        },
        success: function(data) {
          // Check if user is logged
          parseJsonResults(data);
          $.ajax({
            url: '/user/',
            type: 'POST',
            data: {},
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
            },
            success: function(data) {
              if(data['user'] !== undefined)
              {
                console.log("Logged");
                var objData = readCookie('query-selection');
                
                ($("#"+objData).addClass("active"));
                  
                // Restore selection
                $.ajax({
                  url: '/event/go',
                  type: 'GET',
                  data: {id: objData},
                  error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                  },
                  success: function(data) {
                    eraseCookie('query-selection');
                    eraseCookie('query');
                    eraseCookie('login-restore');
                    ($("#"+objData).html(data['going'] + " going"));
                  }
                });
              }
              else
              {
                console.log("Not logged in :(")
              }
            }
          });
        }
      });
    
  }

  $("#search").keypress(function() {
     $("#header").addClass("hidden");
  });

  /**
    When user tries to click on go button
  */
  $('#search-results').on('click', '.btn-social', function (e) {  
    
    // If not logged in, prompts user to do so
    if(readCookie('user') === "false")
    {
      createCookie('login-restore',"true",1);
      createCookie('query-selection',($(this).attr("value")),1);
      $('#myModal').modal('show');
    }
    else
    {
      var obj = ($(this).attr("value"));
      e.stopPropagation();
      e.preventDefault();

      if($(this).hasClass("active"))
      {
        ($(this).removeClass("active"));
        
        $.ajax({
          url: '/event/ungo',
          type: 'GET',
          data: {id: ($(this).attr("value"))},
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          },
          success: function(data) {
            ($("#"+obj).html(data['going'] + " going"));
          }
        });
      }
      else
      {
        ($(this).addClass("active"));
        
        $.ajax({
          url: '/event/go',
          type: 'GET',
          data: {id: ($(this).attr("value"))},
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          },
          success: function(data) {
            ($("#"+obj).html(data['going'] + " going"));
          }
        });
      }

    }
  });

  $("#search-btn").on('click',function(e)
  {
    createCookie('query',$("#search").serialize(),1)

    $("#search-results").html('<div class="text-center"><i class="fa fa-circle-o-notch fa-spin fa-5x"></i></div>');
    query = $("#search").serialize();

    e.stopPropagation();
    e.preventDefault();
    
    $.ajax({
      url: '/event/search',
      type: 'GET',
      data: query,
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        $("#search-results").html('');
        $("#search-results").append("<h4 class='text-center'>Error: "+jqXHR['responseJSON']['message']['source']['text']+" :(</h4>");
      },
      success: function(data) {
        parseJsonResults(data);
      }
    });
  });

  function parseJsonResults(res) {

    var html = "";
    html += "<table class='bus-table'>";

    data = res.message.businesses;
    for(var i=0; i < data.length; i++)
      {
      html += "<tr class='bus'>";
        // Business image
        html += "<td class='bus-avatar'>";
          html += "<a href="+data[i.toString()]['url']+">";
          if(data[i.toString()]['image_url'] !== undefined) 
            html += "<img src="+data[i.toString()]['image_url']+" class='media-object pull-left img-rounded'>";
          else
            html += "<img src='http://images.clipartpanda.com/restaurant-clipart-restaurant-b-w.svg' class='media-object pull-left img-circle'>";
          html += "</a>";
        html += "</td>";
        // Business description
        html += "<td class='bus-body'>";
          html += "<h2 class='media-heading'>"+data[i.toString()]['name']+"</h2>";
          html += "<p>"
            html += "<img src="+data[i.toString()]['rating_img_url']+" class='img-responsive' style='display: inline;'> ";
            html += data[i.toString()]['review_count']+" reviews";
            html += "</p>";
            html += "<p>"+data[i.toString()]['location']['display_address']+"</p>";
        html += "</td>";
        // Social, who's going?
        html += "<td class='bus-social'>";
          html += "<button class='btn-social btn btn-default' id="+data[i.toString()]['id']+" value="+data[i.toString()]['id']+" type='button'>"+data[i.toString()]['going']+" going</button>";
        html += "</td>";
      html += "</tr>";
    };

    html += "</table>";

    $("#search-results").html('');
    $("#search-results").append(html);
  
  }

});