<!-- 
This code generates a list of publications with various details such as title, authors, conference, links, and citation information. It uses a for loop to iterate over the publications data and dynamically generates the HTML markup for each publication.

The publications are displayed in an ordered list (<ol>) with each publication represented as a list item (<li>). The list item contains a row (<div class="pub-row">) with two columns: one for the publication image and abbreviation, and the other for the publication details.

The publication image is displayed using an <img> tag with the source specified by the "link.image" variable. The abbreviation of the conference is displayed as a badge using the <abbr> tag.

The publication details such as title, authors, and conference are displayed within their respective <div> tags.

The links associated with the publication (PDF, code, project page, BibTex) are displayed as buttons using the <a> tag with the appropriate href and target attributes. The buttons are styled using CSS classes.

If there are any additional notes or other information associated with the publication, they are displayed using the <strong> and <i> tags.

If the publication has citation information available, it is displayed within a nested for loop. The citation information includes the title, year, number of citations, and a link to the "Cited By" page.

The code is written in Markdown and is intended to be used in a website or web page to display a list of publications.

-->
<!-- <h1 id="publications"></h1>

<h2 style="margin: 30px 0px -15px;">Publications <temp style="font-size:15px;">[</temp><a href="https://scholar.google.com/citations?hl=en&user=pL5W9z4AAAAJ" target="_blank" style="font-size:15px;">Google Scholar</a><temp style="font-size:15px;">]</temp></h2>


<div class="publications">
<ol class="bibliography">
{% assign gsDataBaseUrl = 'https://raw.githubusercontent.com/song-chen1/song-chen1.github.io/' %}
{% assign url = gsDataBaseUrl | append: 'google-scholar-stats/gs_data.json' %}
{% for link in site.data.publications.main %}


<li>
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
            <abbr class="badge">{{ link.conference_short }}</abbr>
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
      <div class="author">{{ link.authors }}</div>
      <div class="periodical"><em>{{ link.conference }}</em>
      </div>
    <div class="links">
      {% if link.pdf %} 
      <a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">PDF</a>
      {% endif %}
      {% if link.code %} 
      <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Code</a>
      {% endif %}
      {% if link.arxiv %} 
      <a href="{{ link.arxiv }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Arxiv</a>
      {% endif %}
      {% if link.bibtex %} 
      <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
      {% endif %}
      {% if link.notes %} 
      <strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>
      {% endif %}
      {% if link.others %} 
      {{ link.others }}
      {% endif %}
      {% if link.citation %} 
      <strong> <a style="color:#e74d3c; font-weight:600"> • <i class="total_citation_mtl" data-citation="{{ link.citation }}"></i> <i style="color:#e74d3c; font-weight:600"> Citations </i></a></strong>
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
    </div>
  </div>
</div>
</li>

<br>

{% endfor %} -->

<h1 id="publications"></h1>

<h2 style="margin: 30px 0px -15px;">Publications <temp style="font-size:15px;">[</temp><a href="https://scholar.google.com/citations?hl=en&user=pL5W9z4AAAAJ" target="_blank" style="font-size:15px;">Google Scholar</a><temp style="font-size:15px;">]</temp></h2>

<div class="publications">
  <!-- 添加分类按钮 -->
  <div class="publication-filters" style="margin: 20px 0;">
    <button class="filter-btn active" data-category="selected">Selected</button>
    <button class="filter-btn" data-category="multimodal">Multimodal</button>
    <button class="filter-btn" data-category="llm">LLM</button>
    <button class="filter-btn" data-category="trustworthy">Trustworthy AI</button>
  </div>

  <ol class="bibliography">
    <!-- Selected 类别 (默认显示) -->
    <div class="publication-category" id="selected-publications" style="display:block;">
      {% for link in site.data.publication_Selected.main %}
      <li>
        <div class="pub-row">
          <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
            <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
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
              {% if link.arxiv %}
              <a href="{{ link.arxiv }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Arxiv</a>
              {% endif %}
              {% if link.bibtex %}
              <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
              {% endif %}
              {% if link.notes %}
              <strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>
              {% endif %}
              {% if link.others %}
              {{ link.others }}
              {% endif %}
              {% if link.citation %}
              <strong> <a style="color:#e74d3c; font-weight:600"> • <i class="total_citation" data-citation="{{ link.citation }}"></i> <i style="color:#e74d3c; font-weight:600"> Citations </i></a></strong>
              {% endif %}
            </div>
          </div>
        </div>
      </li>
      <br>
      {% endfor %}
    </div>

    <!-- Multimodal 类别 -->
    <div class="publication-category" id="multimodal-publications" style="display:none;">
      {% for link in site.data.publication_Multimodal.main %}
      <li>
        <div class="pub-row">
          <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
            <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
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
              {% if link.arxiv %}
              <a href="{{ link.arxiv }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Arxiv</a>
              {% endif %}
              {% if link.bibtex %}
              <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
              {% endif %}
              {% if link.notes %}
              <strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>
              {% endif %}
              {% if link.others %}
              {{ link.others }}
              {% endif %}
              {% if link.citation %}
              <strong> <a style="color:#e74d3c; font-weight:600"> • <i class="total_citation" data-citation="{{ link.citation }}"></i> <i style="color:#e74d3c; font-weight:600"> Citations </i></a></strong>
              {% endif %}
            </div>
          </div>
        </div>
      </li>
      <br>
      {% endfor %}
    </div>

    <!-- LLM 类别 -->
    <div class="publication-category" id="llm-publications" style="display:none;">
      {% for link in site.data.publication_LLM.main %}
      <li>
        <div class="pub-row">
          <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
            <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
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
              {% if link.arxiv %}
              <a href="{{ link.arxiv }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Arxiv</a>
              {% endif %}
              {% if link.bibtex %}
              <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
              {% endif %}
              {% if link.notes %}
              <strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>
              {% endif %}
              {% if link.others %}
              {{ link.others }}
              {% endif %}
              {% if link.citation %}
              <strong> <a style="color:#e74d3c; font-weight:600"> • <i class="total_citation" data-citation="{{ link.citation }}"></i> <i style="color:#e74d3c; font-weight:600"> Citations </i></a></strong>
              {% endif %}
            </div>
          </div>
        </div>
      </li>
      <br>
      {% endfor %}
    </div>

    <!-- Trustworthy AI 类别 -->
    <div class="publication-category" id="trustworthy-publications" style="display:none;">
      {% for link in site.data.publication_Trustworthy.main %}
      <li>
        <div class="pub-row">
          <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
            <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
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
              {% if link.arxiv %}
              <a href="{{ link.arxiv }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Arxiv</a>
              {% endif %}
              {% if link.bibtex %}
              <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
              {% endif %}
              {% if link.notes %}
              <strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>
              {% endif %}
              {% if link.others %}
              {{ link.others }}
              {% endif %}
              {% if link.citation %}
              <strong> <a style="color:#e74d3c; font-weight:600"> • <i class="total_citation" data-citation="{{ link.citation }}"></i> <i style="color:#e74d3c; font-weight:600"> Citations </i></a></strong>
              {% endif %}
            </div>
          </div>
        </div>
      </li>
      <br>
      {% endfor %}
    </div>
  </ol>

  <!-- 引用计数脚本 -->
  <script>
    $(document).ready(function () {
      var gsDataBaseUrl = 'https://raw.githubusercontent.com/song-chen1/song-chen1.github.io/';
      
      // 加载引用数据
      $.getJSON(gsDataBaseUrl + "google-scholar-stats/gs_data.json", function (data) {
        var citationEles = document.getElementsByClassName('total_citation');
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
      
      // 分类按钮的点击事件
      $('.filter-btn').click(function() {
        var category = $(this).data('category');
        
        // 更新按钮状态
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // 隐藏所有类别
        $('.publication-category').hide();
        
        // 显示选中的类别
        $('#' + category + '-publications').show();
      });
    });
  </script>

  <!-- 添加CSS样式 -->
  <style>
    .publication-filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 25px;
    }
    
    .filter-btn {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 6px 15px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
      background-color: #e8e8e8;
    }
    
    .filter-btn.active {
      background-color: #4285f4;
      color: white;
      border-color: #4285f4;
    }
  </style>
</div>