$(document).ready(function(){
  var query = "";

  $("#search").keypress(function() {
     $("#header").addClass("hidden");
  });

  $('#search-results').on('click', '.btn-social', function (e) { 
    var obj = ((this));
    e.stopPropagation();
    e.preventDefault();

    if($(this).hasClass("active"))
    {
      console.log("Oops, not going :(");
      ($(this).removeClass("active"));
      
      $.ajax({
        url: '/event/ungo',
        type: 'GET',
        data: {id: ($(this).attr("value"))},
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
        },
        success: function(data) {
          ($(obj).html(data['going'] + " going"));
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
          ($(obj).html(data['going'] + " going"));
        }
      });
    }
  });

  $("#search-btn").on('click',function(e)
  {
    $("#search-results").html('<div class="text-center"><i class="fa fa-circle-o-notch fa-spin fa-5x"></i></div>');
    query = $("#search").serialize();

    e.stopPropagation();
    e.preventDefault();
    
    $.ajax({
      url: '/event/search',
      type: 'GET',
      data: query,
      error: function(jqXHR, textStatus, errorThrown) {
        $("#search-results").html('');
        $("#search-results").append("<h4 class='text-center'>"+jqXHR['responseJSON']['message']+"</h4>");
      },
      success: function(data) {
        console.log(data);
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
          html += "<button class='btn-social btn btn-default' value="+data[i.toString()]['id']+" type='button'>"+data[i.toString()]['going']+" going</button>";
        html += "</td>";
      html += "</tr>";
    };

    html += "</table>";

    $("#search-results").html('');
    $("#search-results").append(html);
  
  }

});