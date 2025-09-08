
'use client';

import { useState } from 'react';
import { 
  TwitterEmbed, 
  InstagramEmbed, 
  YouTubeEmbed, 
  TikTokEmbed, 
  FacebookEmbed, 
  LinkedInEmbed,
  PinterestEmbed
} from 'react-social-media-embed';

export default function Home() {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  const detectPlatform = (url: string) => {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('pinterest.com')) return 'pinterest';
    if (url.includes('bsky.app') || url.includes('blueskyweb.xyz')) return 'bluesky';
    return null;
  };

  const detectOrientation = (url: string, platform: string) => {
    // YouTube - check for shorts (portrait) vs regular videos (landscape)
    if (platform === 'youtube') {
      if (url.includes('/shorts/')) return 'portrait';
      return 'landscape';
    }
    
    // TikTok - always portrait
    if (platform === 'tiktok') {
      return 'portrait';
    }
    
    // Instagram - check for reels (portrait) vs posts (square/landscape)
    if (platform === 'instagram') {
      if (url.includes('/reel/') || url.includes('/reels/')) return 'portrait';
      return 'square';
    }
    
    // Pinterest - check for pins (portrait) vs boards (landscape)
    if (platform === 'pinterest') {
      if (url.includes('/pin/')) return 'portrait';
      return 'landscape';
    }
    
    // Twitter/X, Facebook, LinkedIn, Bluesky - typically landscape for posts
    if (['twitter', 'facebook', 'linkedin', 'bluesky'].includes(platform)) {
      return 'landscape';
    }
    
    return 'unknown';
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddUrl = () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    const platform = detectPlatform(url);
    if (!platform) {
      setError('Unsupported social media platform. Supported: Twitter, Instagram, YouTube, TikTok, Facebook, LinkedIn, Pinterest, Bluesky');
      return;
    }

    setUrls(prev => [...prev, url]);
    setUrl('');
    setError('');
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const renderEmbed = (url: string, index: number) => {
    const platform = detectPlatform(url);
    const orientation = detectOrientation(url, platform || '');
    
    // Adjust height based on orientation
    let height = 400;
    if (orientation === 'portrait') {
      height = 600; // Taller for portrait content
    } else if (orientation === 'square') {
      height = 500; // Medium height for square content
    }
    
    const embedProps = {
      url: url,
      width: '100%',
      height: height
    };

    switch (platform) {
      case 'twitter':
        return <TwitterEmbed key={index} {...embedProps} />;
      case 'instagram':
        return <InstagramEmbed key={index} {...embedProps} />;
      case 'youtube':
        return <YouTubeEmbed key={index} {...embedProps} />;
      case 'tiktok':
        return <TikTokEmbed key={index} {...embedProps} />;
      case 'facebook':
        return <FacebookEmbed key={index} {...embedProps} />;
      case 'linkedin':
        return <LinkedInEmbed key={index} {...embedProps} />;
      case 'pinterest':
        return <PinterestEmbed key={index} {...embedProps} />;
      case 'bluesky':
        return <TwitterEmbed key={index} {...embedProps} />; // Using TwitterEmbed for Bluesky as they're similar
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Social Media Embed Generator
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter social media URL (Twitter, Instagram, YouTube, TikTok, Facebook, LinkedIn, Pinterest, Bluesky)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleAddUrl}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Embed
            </button>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">Supported platforms:</p>
            <div className="flex flex-wrap gap-2">
              {['Twitter/X', 'Instagram', 'YouTube', 'TikTok', 'Facebook', 'LinkedIn', 'Pinterest', 'Bluesky'].map(platform => (
                <span key={platform} className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {urls.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Embeds ({urls.length})
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {urls.map((url, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 relative group">
                  <button
                    onClick={() => handleRemoveUrl(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove embed"
                  >
                    ×
                  </button>
                  
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 truncate" title={url}>
                      {url}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {detectPlatform(url)?.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        detectOrientation(url, detectPlatform(url) || '') === 'portrait' 
                          ? 'bg-green-100 text-green-800' 
                          : detectOrientation(url, detectPlatform(url) || '') === 'square'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {detectOrientation(url, detectPlatform(url) || '').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    {renderEmbed(url, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {urls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No embeds yet</h3>
            <p className="text-gray-500">Add a social media URL above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
