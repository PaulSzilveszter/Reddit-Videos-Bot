export class Post {
    constructor(video_url, audio_url) {
        this.video_url = video_url
        this.audio_url = audio_url
    }
    get getVideoURL() {
        return this.video_url;
    }
    get getAudioURL() {
        return this.audio_url;
    }
}