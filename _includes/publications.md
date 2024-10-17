<h1 id="publications"></h1>

<h2 style="margin: 30px 0px -15px;">Publications <temp style="font-size:15px;">[</temp><a href="https://scholar.google.com/citations?hl=zh-CN&user=pL5W9z4AAAAJ" target="_blank" style="font-size:15px;">Google Scholar</a><temp style="font-size:15px;">]</temp></h2>

<div class="publications">
  <ol class="bibliography">
    {% for link in site.data.publications.main %}
      <li>
        <div class="pub-row">
          <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
            <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width: 100%; height: 40%;">
            <abbr class="badge">{{ link.conference_short }}</abbr>
          </div>
          <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
            <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
            <div class="author">{{ link.authors }}</div>
            <div class="periodical"><em>{{ link.conference }}</em></div>
            <div class="links">
              {% if link.pdf %} 
                <a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">PDF</a>
              {% endif %}
              {% if link.code %} 
                <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Code</a>
              {% endif %}
              {% if link.page %} 
                <a href="{{ link.page }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Project Page</a>
              {% endif %}
              {% if link.bibtex %} 
                <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
              {% endif %}
              {% if link.notes %}
                <strong><i style="color:#e74d3c">{{ link.notes }}</i></strong>
              {% endif %}
              {% if link.others %}
                {{ link.others }}
              {% endif %}
              {% if link.citation %}
                <strong><a style="color:#e74d3c; font-weight:600"> • <i class="total_citation_mtl" data-citation="{{ link.citation }}"></i> <i style="color:#e74d3c; font-weight:600">Citations</i></a></strong>
                <script>
                  $(document).ready(function () {
                    var gsDataBaseUrl = 'https://raw.githubusercontent.com/song-chen1/song-chen1.github.io/';
                    $.getJSON(gsDataBaseUrl + "google-scholar-stats/gs_data.json", function (data) {
                      var citationEles = document.getElementsByClassName('total_citation_mtl');
                      Array.prototype.forEach.call(citationEles, function(element) {
                        var citationKey = element.getAttribute('data-citation');
                        if (data['publications'][citationKey]) {
                          var numCitations = data['publications'][citationKey]['num_citations'];
                          element.innerHTML = numCitations;
                        } else {
                          element.innerHTML = 'N/A';
                        }
                      });
                    });
                  });
                </script>
              {% endif %}
            </div> <!-- 结束 links -->
          </div> <!-- 结束 col-sm-9 -->
        </div> <!-- 结束 pub-row -->
      </li> <!-- 结束 li -->
      <br>
    {% endfor %}
  </ol>
</div>
