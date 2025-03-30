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

<!-- 添加分类按钮 -->
<div id="pub-tabs" class="tabs" style="margin: 20px 0;">
  <button class="tab-button active" data-category="Selected">Selected</button>
  <button class="tab-button" data-category="Multimodal">Multimodal</button>
  <button class="tab-button" data-category="LLM">LLM</button>
  <button class="tab-button" data-category="Trustworthy">Trustworthy AI</button>
</div>

<div class="publications">
  <ol class="bibliography" id="pub-list">
    <!-- 默认显示Selected类别的文章 -->
    {% for link in site.data.publication_Selected.main %}
    <li class="publication-item" data-category="Selected">
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

    <!-- Multimodal类别的文章 -->
    {% for link in site.data.publication_Multimodal.main %}
    <li class="publication-item" data-category="Multimodal" style="display: none;">
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

    <!-- LLM类别的文章 -->
    {% for link in site.data.publication_LLM.main %}
    <li class="publication-item" data-category="LLM" style="display: none;">
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

    <!-- Trustworthy AI类别的文章 -->
    {% for link in site.data.publication_Trustworthy.main %}
    <li class="publication-item" data-category="Trustworthy" style="display: none;">
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
  </ol>

  <!-- 引用计数脚本 -->
  <script>
    $(document).ready(function() {
      // 加载引用数据
      var gsDataBaseUrl = 'https://raw.githubusercontent.com/song-chen1/song-chen1.github.io/';
      $.getJSON(gsDataBaseUrl + "google-scholar-stats/gs_data.json", function(data) {
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
      $('.tab-button').click(function() {
        // 更新按钮状态
        $('.tab-button').removeClass('active');
        $(this).addClass('active');
        
        // 获取选中的类别
        var category = $(this).data('category');
        
        // 隐藏所有文章
        $('.publication-item').hide();
        
        // 显示对应类别的文章
        $('.publication-item[data-category="' + category + '"]').show();
      });
    });
  </script>

  <!-- 添加CSS样式 -->
  <style>
    /* 分类按钮样式 */
    .tabs {
      margin: 20px 0;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .tab-button {
      padding: 6px 12px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      cursor: pointer;
      border-radius: 6px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .tab-button.active {
      background-color: #2c3e50;
      color: #fff;
      border-color: #2c3e50;
    }

    .tab-button:hover {
      background-color: #e0e0e0;
    }

    /* 响应式调整 */
    @media (max-width: 600px) {
      .tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .tab-button {
        flex: none;
      }
    }
  </style>
</div>