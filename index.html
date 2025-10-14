// Fullscreen functionality for BREEZE app
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const breezeContainer = document.getElementById('breeze-container');
    const breezeIframe = document.getElementById('breeze-iframe');
    
    if (fullscreenBtn && breezeContainer) {
        fullscreenBtn.addEventListener('click', function() {
            if (!breezeContainer.classList.contains('fullscreen')) {
                // Enter fullscreen
                breezeContainer.classList.add('fullscreen');
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
                
                // Try to use native fullscreen API
                if (breezeContainer.requestFullscreen) {
                    breezeContainer.requestFullscreen();
                } else if (breezeContainer.webkitRequestFullscreen) {
                    breezeContainer.webkitRequestFullscreen();
                } else if (breezeContainer.mozRequestFullScreen) {
                    breezeContainer.mozRequestFullScreen();
                } else if (breezeContainer.msRequestFullscreen) {
                    breezeContainer.msRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                exitFullscreen();
            }
        });
        
        // Handle ESC key and native fullscreen exit
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                exitFullscreen();
            }
        }
        
        function exitFullscreen() {
            breezeContainer.classList.remove('fullscreen');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
            
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});