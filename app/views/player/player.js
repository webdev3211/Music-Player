'use strict';

angular.module('Player.player', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/player', {
                templateUrl: './views/player/player.html',
                controller: 'PlayerCtrl'
            })
    }])

    .controller('PlayerCtrl', function ($scope, $location) {
        $scope.musicSelected = false;
        $scope.trackName = null;
        $scope.songList = [];
        $scope.songPlaying = false;
        $scope.playListVisible = false;
        $scope.wave = null;
        $scope.ErrorOccurred = false;

        const ipc = require('electron').ipcRenderer;
        //Uncomment if model required
        // ipc.on('modal-error', function(){
        //     if(!$scope.ErrorOccurred){
        //         $scope.ErrorOccurred = true;
        //     }else{
        //         $scope.ErrorOccurred = false;     
        //     }
        //     console.log($scope.ErrorOccurred); 
        // });

        ipc.on('modal-folder-content', function (event, arg) {

            console.log(arg);
            $scope.songsList = arg.files;
            // console.log('Songs list',songList);
            $scope.$apply();
            let songsArrayForPlaying = [];
            if ($scope.wave) {
                $scope.wave.stop();
            }
            console.log(arg.files);



            for (var i = 0; i < arg.files.length; i++) {
                songsArrayForPlaying.push({
                    title: arg.path + '/' + arg.files[i],
                    file: arg.path + '/' + arg.files[i],
                    howl: null,
                    name: arg.files[i]
                });
            }

            console.log('Songs array: ', songsArrayForPlaying);

            $scope.player = new Player(songsArrayForPlaying);

            $scope.musicSelected = true;
            // $scope.songPlaying = true;

            if (!$scope.wave) {
                $scope.wave = new SiriWave({
                    container: waveform,
                    width: window.innerWidth,
                    height: window.innerHeight * 0.3,
                    cover: true,
                    speed: 0.02,
                    amplitude: 0.5,
                    frequency: 2
                });
            }
            $scope.wave.start();
            $scope.player.play();
            $scope.songPlaying = true;
            $scope.$apply(); //becauuse it is an asynchronous method to reload or re run the digest - cycle of angular
        });

        $scope.seekToTime = function ($event) {
            $scope.player.seek($event.clientX / window.innerWidth);
        }

        $scope.playPlaylistSong = function (index) {
            $scope.player.pause();
            $scope.playListVisible = false;
            $scope.player.skipTo(index);
        }

        $scope.showPlaylist = function () {
            if ($scope.playListVisible) {
                $scope.playListVisible = false;
            }
            else {
                $scope.playListVisible = true;
            }
        }

        $scope.prevSong = function () {
            $scope.player.skip('prev');
            $scope.songPlaying = true;
        }


        $scope.nextSong = function () {
            $scope.player.skip('next');
            $scope.songPlaying = true;
        }

        $scope.playMusic = function () {
            if ($scope.songPlaying) {
                $scope.songPlaying = false;
                $scope.player.pause();
            }
            else {
                $scope.songPlaying = true;
                $scope.player.play();
            }

        };

        var Player = function (playlist) {
            this.playlist = playlist;
            // $scope.songPlaying = false;
            this.index = 0;
        }

        Player.prototype = {
            play: function (index) {
                var self = this;
                var sound;
                console.log(self);
                index = typeof index === 'number' ? index : self.index;
                var data = self.playlist[index];
                console.log('Data: ', data);
                $scope.trackName = data.name;
                if (data.howl) {
                    sound = data.howl;
                } else {
                    sound = data.howl = new Howl({
                        src: [data.file],
                        html5: true,
                        onplay: function () {
                            $scope.timer = self.formatTime(Math.round(sound.duration()));
                            requestAnimationFrame(self.step.bind(self));
                            $scope.$apply();
                        },
                        onend: function () {
                            self.skip('right');
                        }
                    })
                }

                sound.play();
                self.index = index;

            },
            formatTime: function (secs) {  //it takes the time in seconds
                var minutes = Math.floor(secs / 60) || 0;
                var seconds = (secs - minutes * 60) || 0;
                return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            },
            step: function () {
                var self = this;
                var sound = self.playlist[self.index].howl;
                var seek = sound.seek() || 0;
                progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';
                if (sound.playing()) {
                    requestAnimationFrame(self.step.bind(self));
                }
            },
            pause: function () {
                var self = this;
                var sound = self.playlist[self.index].howl;
                sound.pause();
            },
            skip: function (direction) {  //directs to play the next song or the previous song in the palylist
                var self = this;
                var index = 0;
                if (direction === 'prev') {
                    index = self.index - 1;
                    if (index < 0) {      //go to last of playlist if we have reached the ifrts song in the playlist
                        index = self.playlist.length - 1;
                    }
                }
                else {
                    index = self.index + 1;
                    if (index >= self.playlist.length) {
                        index = 0;
                    }
                }
                self.skipTo(index);
            },
            skipTo: function (index) {    //check if the song selected is been played at the current time
                var self = this;
                if (self.playlist[self.index].howl) {
                    self.playlist[self.index].howl.stop();
                }
                $scope.songPlaying = true;
                self.play(index);
            },
            seek: function (time) {
                var self = this;
                // Get the Howl we want to manipulate.
                var sound = self.playlist[self.index].howl;

                // Convert the percent into a seek position.
                if (sound.playing()) {
                    sound.seek(sound.duration() * time);
                }
            }
        }

    })
