(function(videoContainerSelector, onYouTubePlayerAPIReady) {
    'use strict';

    var supernova = supernova || {};
    window.supernova = supernova;

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/player_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var videoContainer = document.querySelector(videoContainerSelector);
    var videoPlayerWrapper = videoContainer.querySelector('[data-src]');
    var videoId = videoPlayerWrapper.getAttribute('data-src');
    var buffer = parseInt(videoPlayerWrapper.getAttribute('data-buffer') || 2000);
    var player;

    supernova.instancePlayer = function() {
        player = new YT.Player(videoPlayerWrapper.getAttribute('id'), {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                playlist: videoId,
                loop: 1,
                modestbranding: 1,
                showinfo: 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    var onPlayerReady = function(event) {
        videoPlayerWrapper = videoContainer.querySelector('[data-src]');
        player.addEventListener('resize', resizeBackgroundVideo);
        resizeBackgroundVideo();
    };
    var onPlayerStateChange = function() {
        setTimeout(function() {
            videoContainer.style.opacity = 1;
        }, buffer);
        setTimeout(function() {
            videoContainer.style.opacity = 0;
        }, (player.getDuration()*1000) - buffer);
    };
    var resizeBackgroundVideo = function() {
        var playerBox = {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
        // Code below borrowed from https://github.com/pupunzi/jquery.mb.YTPlayer
        var margin = 24;
        var overprint = 100;
        playerBox.width = playerBox.width + ((playerBox.width * margin) / 100);
        playerBox.height = Math.ceil((9 * playerBox.width) / 16);
        playerBox.marginTop = -((playerBox.height - playerBox.height) / 2);
        playerBox.marginLeft = -((playerBox.width * (margin / 2)) / 100);
        if (playerBox.height < playerBox.height) {
            playerBox.height = playerBox.height + ((playerBox.height * margin) / 100);
            playerBox.width = Math.floor((16 * playerBox.height) / 9);
            playerBox.marginTop = -((playerBox.height * (margin / 2)) / 100);
            playerBox.marginLeft = -((playerBox.width - playerBox.width) / 2);
        }

        playerBox.width += overprint;
        playerBox.height += overprint;
        playerBox.marginTop -= overprint / 2;
        playerBox.marginLeft -= overprint / 2;

        videoPlayerWrapper.style.width = playerBox.width + 'px';
        videoPlayerWrapper.style.height = playerBox.height + 'px';
        videoPlayerWrapper.style.marginTop = playerBox.marginTop + 'px';
        videoPlayerWrapper.style.marginLeft = playerBox.marginLeft + 'px';
    };

}('.supernova-video-background', onYouTubePlayerAPIReady));

function onYouTubePlayerAPIReady() {
    supernova.instancePlayer.call(supernova);
}
