<h1 id="news"></h1>

<h2 style="margin: 30px 0px 10px;">News</h2>

<div class="news-slider">
  <div class="news-container">
    <ul id="news-list">
      <li><strong>[Jun. 2025]</strong> 🎉🎉 Our <span style="color:#f59ab2"><a href="">JPS</a></span> have been accepted to ACM MM 2025!(CCF-A)</li>
      <li><strong>[Jun. 2025]</strong> 🎉🎉 Our <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2503.21254">Vision-to-Music Generation</a></span> have been accepted to ISMIR 2025!(Top conferences in music AI)</li>
      <li><strong>[Apr. 2025]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://github.com/Alpha-VLLM/Lumina-mGPT-2.0">Lumina-mGPT-2.0</a></span> github repo released <a href='https://github.com/Alpha-VLLM/Lumina-mGPT-2.0'><img src="https://img.shields.io/github/stars/Alpha-VLLM/Lumina-mGPT-2.0"></a>.</li>
      <li><strong>[Mar. 2025]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://github.com/wzk1015/Awesome-Vision-to-Music-Generation">Awesome Vision-to-Music</a></span> github repo released <a href='https://github.com/wzk1015/Awesome-Vision-to-Music-Generation'><img src="https://img.shields.io/github/stars/wzk1015/Awesome-Vision-to-Music-Generation"></a>.</li>
      <li><strong>[Feb. 2025]</strong> 🎉🎉 I've been accepted into the SMC Student Scholarship!</li>
      <li><strong>[Feb. 2025]</strong> 🎉🎉 Our 2 papers <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2411.16824">Beyond Sight</a></span> and <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2411.17470">Scaling Laws for Video DiT</a></span> have been accepted to CVPR 2025!(CCF-A, Acceptance ratio 22.1%)</li>
      <li><strong>[Jan. 2025]</strong> 🎉🎉 <span style="color:#f59ab2"><a href="https://github.com/thu-coai/AISafetyLab">AISafetyLab</a></span> github repo released <a href='https://github.com/thu-coai/AISafetyLab'><img src="https://img.shields.io/github/stars/thu-coai/AISafetyLab"></a>.</li>
      <li><strong>[Dec. 2024]</strong> 🎉🎉 I've been accepted into the AAAI-25 Student Scholarship!</li>
      <li><strong>[Dec. 2024]</strong> 🎉🎉 Our 2 papers <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2405.20775">Medical MLLM is Vulnerable</a></span> and <span style="color:#f59ab2"><a href="https://arxiv.org/pdf/2403.13352">AGFSync</a></span> have been accepted to AAAI 2025!(CCF-A, Acceptance ratio 23.4%)</li>
      <li><strong>[Nov. 2024]</strong> 🎉🎉 Welcome to my YouTube channel <span style="color:#f59ab2"><a href="https://youtube.com/@VSJH2003">@VSJH2003</a></span>!</li>
      <li><strong>[Aug. 2024]</strong> 🎉🎉 I have founded <span style="color:#f59ab2"><a href="https://github.com/MantaAI">MantaAI</a></span>: Modified Approaches in Natural Sciences to Advance Artificial Intelligence. Researchers from around the world who share the same vision are welcome to join.</li>
    </ul>
  </div>
  
  <div class="slider-container">
    <div class="slider-track">
      <div class="slider-thumb" id="slider-thumb"></div>
    </div>
  </div>
</div>

<style>
  .news-slider {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    gap: 15px;
  }
  
  .news-container {
    flex-grow: 1;
    overflow: hidden;
    max-height: 480px;
    position: relative;
  }
  
  #news-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transition: transform 0.2s ease;
  }
  
  #news-list li {
    margin-bottom: 10px;
    padding: 10px;
    background-color: rgba(240, 240, 240, 0.1);
    border-radius: 4px;
  }
  
  .slider-container {
    width: 20px;
    min-height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .slider-track {
    height: 100%;
    width: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    position: relative;
  }
  
  .slider-thumb {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 30px;
    background-color: #9e9e9e;
    border-radius: 3px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: top 0.1s ease;
  }
  
  .slider-thumb:hover {
    background-color: #7e7e7e;
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const newsList = document.getElementById('news-list');
    const newsContainer = document.querySelector('.news-container');
    const sliderThumb = document.getElementById('slider-thumb');
    const sliderTrack = document.querySelector('.slider-track');
    
    const listHeight = newsList.scrollHeight;
    const containerHeight = newsContainer.clientHeight;
    const scrollableDistance = listHeight - containerHeight;
    
    // Only show slider if content overflows
    if (scrollableDistance <= 0) {
      document.querySelector('.slider-container').style.display = 'none';
      return;
    }
    
    // Initial position
    let currentPosition = 0;
    let isDragging = false;
    
    // Function to update the news list position
    function updatePosition(position) {
      // Ensure position is within bounds
      position = Math.max(0, Math.min(position, scrollableDistance));
      currentPosition = position;
      
      // Update news list transform
      newsList.style.transform = `translateY(-${position}px)`;
      
      // Update slider thumb position
      const thumbPosition = (position / scrollableDistance) * (sliderTrack.clientHeight - sliderThumb.clientHeight);
      sliderThumb.style.top = `${thumbPosition}px`;
    }
    
    // Mouse events for dragging the slider
    sliderThumb.addEventListener('mousedown', function(e) {
      isDragging = true;
      e.preventDefault(); // Prevent text selection
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const trackRect = sliderTrack.getBoundingClientRect();
      const thumbHeight = sliderThumb.clientHeight;
      const trackHeight = trackRect.height;
      
      // Calculate position relative to the track
      let relativeY = e.clientY - trackRect.top;
      relativeY = Math.max(thumbHeight / 2, Math.min(relativeY, trackHeight - thumbHeight / 2));
      
      // Calculate the scroll position
      const scrollRatio = (relativeY - thumbHeight / 2) / (trackHeight - thumbHeight);
      const scrollPosition = scrollRatio * scrollableDistance;
      
      updatePosition(scrollPosition);
    });
    
    document.addEventListener('mouseup', function() {
      isDragging = false;
    });
    
    // Track click to jump to position
    sliderTrack.addEventListener('click', function(e) {
      if (e.target === sliderThumb) return;
      
      const trackRect = sliderTrack.getBoundingClientRect();
      const thumbHeight = sliderThumb.clientHeight;
      const trackHeight = trackRect.height;
      
      // Calculate position relative to the track
      let relativeY = e.clientY - trackRect.top;
      relativeY = Math.max(thumbHeight / 2, Math.min(relativeY, trackHeight - thumbHeight / 2));
      
      // Calculate the scroll position
      const scrollRatio = (relativeY - thumbHeight / 2) / (trackHeight - thumbHeight);
      const scrollPosition = scrollRatio * scrollableDistance;
      
      updatePosition(scrollPosition);
    });
    
    // Mouse wheel scrolling in the news container
    newsContainer.addEventListener('wheel', function(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 30 : -30;
      updatePosition(currentPosition + delta);
    });
    
    // Touch events for mobile
    let startY;
    
    sliderThumb.addEventListener('touchstart', function(e) {
      isDragging = true;
      startY = e.touches[0].clientY;
      e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      
      const trackRect = sliderTrack.getBoundingClientRect();
      const thumbHeight = sliderThumb.clientHeight;
      const trackHeight = trackRect.height;
      
      // Calculate position relative to the track
      let relativeY = e.touches[0].clientY - trackRect.top;
      relativeY = Math.max(thumbHeight / 2, Math.min(relativeY, trackHeight - thumbHeight / 2));
      
      // Calculate the scroll position
      const scrollRatio = (relativeY - thumbHeight / 2) / (trackHeight - thumbHeight);
      const scrollPosition = scrollRatio * scrollableDistance;
      
      updatePosition(scrollPosition);
    });
    
    document.addEventListener('touchend', function() {
      isDragging = false;
    });
    
    // Initialize the thumb position
    updatePosition(0);
  });
</script>