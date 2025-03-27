<h1 id="news"></h1>

<h2 style="margin: 30px 0px 10px;">News</h2>

<div class="news-carousel">
  <div class="news-container">
    <ul id="news-list">
      <li><strong>[Feb. 2025]</strong> 🎉🎉 I've been accepted into the SMC Student Scholarship!</li>
      <li><strong>[Feb. 2025]</strong> 🎉🎉 Our 2 papers <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2411.16824">Beyond Sight</a></span> and <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2411.17470">Scaling Laws for Video DiT</a></span> have been accepted to CVPR 2025!(CCF-A, Acceptance ratio 22.1%)</li>
      <li><strong>[Jan. 2025]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://github.com/thu-coai/AISafetyLab">AISafetyLab</a></span> github repo released <a href='https://github.com/thu-coai/AISafetyLab'><img src="https://img.shields.io/github/stars/thu-coai/AISafetyLab"></a>.</li>
      <li><strong>[Dec. 2024]</strong> 🎉🎉 I've been accepted into the AAAI-25 Student Scholarship!</li>
      <li><strong>[Dec. 2024]</strong> 🎉🎉 Our 2 papers <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2405.20775">Medical MLLM is Vulnerable</a></span> and <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2403.13352">AGFSync</a></span> have been accepted to AAAI 2025!(CCF-A, Acceptance ratio 23.4%)</li>
      <li><strong>[Nov. 2024]</strong> 🎉🎉 Welcome to my YouTube channel <span style="color:#f59ab2"><a href="https://youtube.com/@VSJH2003">@VSJH2003</a></span>!</li>
      <li><strong>[Aug. 2024]</strong> 🎉🎉 I have founded <span style="color:#f59ab2"><a href="https://github.com/MantaAI">MantaAI</a></span>: Modified Approaches in Natural Sciences to Advance Artificial Intelligence. Researchers from around the world who share the same vision are welcome to join.</li>
    </ul>
  </div>
  
  <div class="carousel-controls">
    <button id="prev-btn" aria-label="Previous news">&lt;</button>
    <div class="carousel-indicators" id="carousel-indicators"></div>
    <button id="next-btn" aria-label="Next news">&gt;</button>
  </div>
</div>

<style>
  .news-carousel {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
  }
  
  .news-container {
    overflow: hidden;
  }
  
  #news-list {
    transition: transform 0.4s ease;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  #news-list li {
    margin-bottom: 10px;
    padding: 10px;
    background-color: rgba(240, 240, 240, 0.1);
    border-radius: 4px;
  }
  
  .carousel-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }
  
  #prev-btn, #next-btn {
    background-color: #f0f0f0;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-weight: bold;
    margin: 0 10px;
  }
  
  #prev-btn:hover, #next-btn:hover {
    background-color: #e0e0e0;
  }
  
  .carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 5px;
  }
  
  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ccc;
    cursor: pointer;
  }
  
  .indicator.active {
    background-color: #f59ab2;
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const newsList = document.getElementById('news-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.getElementById('carousel-indicators');
    
    const newsItems = Array.from(newsList.children);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(newsItems.length / itemsPerPage);
    let currentPage = 0;
    
    // Hide all items initially
    newsItems.forEach((item, index) => {
      if (index >= itemsPerPage) {
        item.style.display = 'none';
      }
    });
    
    // Create indicators
    for (let i = 0; i < totalPages; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (i === 0) {
        indicator.classList.add('active');
      }
      indicator.addEventListener('click', () => {
        goToPage(i);
      });
      indicators.appendChild(indicator);
    }
    
    function goToPage(page) {
      if (page < 0 || page >= totalPages) return;
      
      currentPage = page;
      
      // Hide all items
      newsItems.forEach(item => {
        item.style.display = 'none';
      });
      
      // Show items for current page
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, newsItems.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        newsItems[i].style.display = 'block';
      }
      
      // Update indicators
      Array.from(indicators.children).forEach((indicator, index) => {
        if (index === currentPage) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
    
    prevBtn.addEventListener('click', () => {
      goToPage(currentPage - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      goToPage(currentPage + 1);
    });
  });
</script>
<!-- <li><strong>[Aug. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2407.21669">Synth-Empathy</a></span> github repo released <a href='https://github.com/Aurora-slz/Synth-Empathy'><img src="https://img.shields.io/github/stars/Aurora-slz/Synth-Empathy"></a>.</li>
<li><strong>[Aug. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2407.20756">SynthVLM</a></span> github repo released <a href='https://github.com/starriver030515/SynthVLM'><img src="https://img.shields.io/github/stars/starriver030515/SynthVLM"></a>.</li> -->
<!-- <li><strong>[Jun. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/abs/2405.20775">O2M_attack</a></span> dataset 3MAD-Tiny-1K released <a href="https://huggingface.co/datasets/MedMLLM-attack/3MAD-Tiny-1K"><img src="../images/dataset-on-hf-sm.svg"></a> 3MAD-66K released <a href="https://huggingface.co/datasets/MedMLLM-attack/3MAD-66K"><img src="../images/dataset-on-hf-sm.svg"></a>.</li> -->
<!-- <li><strong>[Jun. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/abs/2405.20775">O2M_attack</a></span> github repo released <a href='https://github.com/dirtycomputer/O2M_attack'><img src="https://img.shields.io/github/stars/dirtycomputer/O2M_attack"></a>.</li> -->
</ul>