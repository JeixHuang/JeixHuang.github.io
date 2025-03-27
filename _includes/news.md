<h1 id="news"></h1>

<div class="news-section">
  <h2 class="news-heading">News</h2>
  
  <div class="news-carousel">
    <div class="news-viewport">
      <ul id="news-items">
        <li class="news-item">
          <div class="news-date">[Feb. 2025]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p>I've been accepted into the SMC Student Scholarship!</p>
          </div>
        </li>
        <li class="news-item">
          <div class="news-date">[Feb. 2025]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p>Our 2 papers <span class="highlight-link"><a href="https://arxiv.org/pdf/2411.16824">Beyond Sight</a></span> and <span class="highlight-link"><a href="https://arxiv.org/pdf/2411.17470">Scaling Laws for Video DiT</a></span> have been accepted to CVPR 2025!(CCF-A, Acceptance ratio 22.1%)</p>
          </div>
        </li>
        <li class="news-item">
          <div class="news-date">[Jan. 2025]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p><span class="highlight-link"><a href="https://github.com/thu-coai/AISafetyLab">AISafetyLab</a></span> github repo released <a href='https://github.com/thu-coai/AISafetyLab'><img src="https://img.shields.io/github/stars/thu-coai/AISafetyLab"></a>.</p>
          </div>
        </li>
        <li class="news-item">
          <div class="news-date">[Dec. 2024]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p>I've been accepted into the AAAI-25 Student Scholarship!</p>
          </div>
        </li>
        <li class="news-item">
          <div class="news-date">[Dec. 2024]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p>Our 2 papers <span class="highlight-link"><a href="https://arxiv.org/pdf/2405.20775">Medical MLLM is Vulnerable</a></span> and <span class="highlight-link"><a href="https://arxiv.org/pdf/2403.13352">AGFSync</a></span> have been accepted to AAAI 2025!(CCF-A, Acceptance ratio 23.4%)</p>
          </div>
        </li>
        <li class="news-item">
          <div class="news-date">[Nov. 2024]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p>Welcome to my YouTube channel <span class="highlight-link"><a href="https://youtube.com/@VSJH2003">@VSJH2003</a></span>!</p>
          </div>
        </li>
        <li class="news-item">
          <div class="news-date">[Aug. 2024]</div>
          <div class="news-content">
            <span class="news-emoji">🎉🎉</span>
            <p>I have founded <span class="highlight-link"><a href="https://github.com/MantaAI">MantaAI</a></span>: Modified Approaches in Natural Sciences to Advance Artificial Intelligence. Researchers from around the world who share the same vision are welcome to join.</p>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="news-navigation">
      <button id="prev-news" class="nav-button" aria-label="Previous news">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
      </button>
      
      <div class="news-pagination" id="news-pagination"></div>
      
      <button id="next-news" class="nav-button" aria-label="Next news">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<style>
  .news-section {
    margin: 2rem 0;
    position: relative;
  }
  
  .news-heading {
    margin: 30px 0px 20px;
    font-size: 1.8rem;
    position: relative;
    display: inline-block;
  }
  
  .news-heading:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: #f59ab2;
  }
  
  .news-carousel {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .news-viewport {
    overflow: hidden;
    position: relative;
  }
  
  #news-items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: nowrap;
    transition: transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }
  
  .news-item {
    min-width: 100%;
    padding: 1.5rem;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    transition: all 0.3s ease;
  }
  
  .news-item:hover {
    background: rgba(245, 154, 178, 0.05);
  }
  
  .news-date {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .news-content {
    display: flex;
    align-items: flex-start;
  }
  
  .news-emoji {
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
  
  .news-content p {
    margin: 0;
    line-height: 1.5;
    flex: 1;
  }
  
  .highlight-link a {
    color: #f59ab2;
    text-decoration: none;
    transition: color 0.2s;
    border-bottom: 1px dotted #f59ab2;
  }
  
  .highlight-link a:hover {
    color: #d47a94;
    border-bottom: 1px solid #d47a94;
  }
  
  .news-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: rgba(250, 250, 250, 0.03);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .nav-button {
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  .nav-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .nav-button:focus {
    outline: none;
  }
  
  .nav-button svg {
    fill: #666;
  }
  
  .news-pagination {
    display: flex;
    gap: 8px;
    margin: 0 15px;
  }
  
  .page-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ddd;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .page-dot.active {
    background-color: #f59ab2;
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    .news-item {
      padding: 1rem;
    }
    
    .news-navigation {
      padding: 0.75rem;
    }
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const newsItems = document.getElementById('news-items');
    const prevButton = document.getElementById('prev-news');
    const nextButton = document.getElementById('next-news');
    const pagination = document.getElementById('news-pagination');
    
    const itemsPerPage = 5;
    const items = Array.from(newsItems.children);
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentPage = 0;
    
    // Create pagination dots
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.classList.add('page-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToPage(i));
      pagination.appendChild(dot);
    }
    
    // Set up initial state
    updateCarousel();
    
    // Add event listeners
    prevButton.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updateCarousel();
      }
    });
    
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        updateCarousel();
      }
    });
    
    function goToPage(page) {
      currentPage = page;
      updateCarousel();
    }
    
    function updateCarousel() {
      // Calculate which items to show
      const startIndex = currentPage * itemsPerPage;
      const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);
      
      // Hide all items first
      items.forEach(item => {
        item.style.display = 'none';
      });
      
      // Show only visible items
      visibleItems.forEach(item => {
        item.style.display = 'flex';
      });
      
      // Update pagination dots
      const dots = pagination.querySelectorAll('.page-dot');
      dots.forEach((dot, index) => {
        if (index === currentPage) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Update button states
      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === totalPages - 1;
      
      // Apply visual indication of disabled state
      if (prevButton.disabled) {
        prevButton.style.opacity = '0.4';
      } else {
        prevButton.style.opacity = '1';
      }
      
      if (nextButton.disabled) {
        nextButton.style.opacity = '0.4';
      } else {
        nextButton.style.opacity = '1';
      }
    }
  });
</script>
<!-- <li><strong>[Aug. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2407.21669">Synth-Empathy</a></span> github repo released <a href='https://github.com/Aurora-slz/Synth-Empathy'><img src="https://img.shields.io/github/stars/Aurora-slz/Synth-Empathy"></a>.</li>
<li><strong>[Aug. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2407.20756">SynthVLM</a></span> github repo released <a href='https://github.com/starriver030515/SynthVLM'><img src="https://img.shields.io/github/stars/starriver030515/SynthVLM"></a>.</li> -->
<!-- <li><strong>[Jun. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/abs/2405.20775">O2M_attack</a></span> dataset 3MAD-Tiny-1K released <a href="https://huggingface.co/datasets/MedMLLM-attack/3MAD-Tiny-1K"><img src="../images/dataset-on-hf-sm.svg"></a> 3MAD-66K released <a href="https://huggingface.co/datasets/MedMLLM-attack/3MAD-66K"><img src="../images/dataset-on-hf-sm.svg"></a>.</li> -->
<!-- <li><strong>[Jun. 2024]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://arxiv.org/abs/2405.20775">O2M_attack</a></span> github repo released <a href='https://github.com/dirtycomputer/O2M_attack'><img src="https://img.shields.io/github/stars/dirtycomputer/O2M_attack"></a>.</li> -->