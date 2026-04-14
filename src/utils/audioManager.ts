// 音频管理模块

class AudioManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private music: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.5;
  private soundVolume: number = 0.7;

  constructor() {
    // 初始化音频设置
    const savedMuted = localStorage.getItem('bombManMuted');
    if (savedMuted) {
      this.isMuted = savedMuted === 'true';
    }

    const savedMusicVolume = localStorage.getItem('bombManMusicVolume');
    if (savedMusicVolume) {
      this.musicVolume = parseFloat(savedMusicVolume);
    }

    const savedSoundVolume = localStorage.getItem('bombManSoundVolume');
    if (savedSoundVolume) {
      this.soundVolume = parseFloat(savedSoundVolume);
    }
  }

  // 加载音效
  loadSound(name: string, url: string): void {
    const audio = new Audio(url);
    audio.volume = this.soundVolume;
    this.sounds[name] = audio;
  }

  // 加载背景音乐
  loadMusic(url: string): void {
    if (this.music) {
      this.music.pause();
      this.music = null;
    }

    this.music = new Audio(url);
    this.music.volume = this.musicVolume;
    this.music.loop = true;
  }

  // 播放音效
  playSound(name: string): void {
    if (this.isMuted) return;
    
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error('Error playing sound:', err));
    }
  }

  // 播放背景音乐
  playMusic(): void {
    if (this.isMuted) return;
    
    if (this.music) {
      this.music.play().catch(err => console.error('Error playing music:', err));
    }
  }

  // 暂停背景音乐
  pauseMusic(): void {
    if (this.music) {
      this.music.pause();
    }
  }

  // 切换静音状态
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('bombManMuted', this.isMuted.toString());
    
    if (this.isMuted) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
    
    return this.isMuted;
  }

  // 设置音乐音量
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('bombManMusicVolume', this.musicVolume.toString());
    
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }

  // 设置音效音量
  setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('bombManSoundVolume', this.soundVolume.toString());
    
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.soundVolume;
    });
  }

  // 获取静音状态
  getMuted(): boolean {
    return this.isMuted;
  }

  // 获取音乐音量
  getMusicVolume(): number {
    return this.musicVolume;
  }

  // 获取音效音量
  getSoundVolume(): number {
    return this.soundVolume;
  }
}

// 导出单例
export const audioManager = new AudioManager();