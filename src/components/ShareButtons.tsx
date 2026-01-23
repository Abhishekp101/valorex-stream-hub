import { Facebook, Twitter, Share2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied!',
        description: 'The link has been copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: Share2,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      className: 'bg-green-600 hover:bg-green-700 text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      className: 'bg-sky-500 hover:bg-sky-600 text-white',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="sm"
          className={link.className}
          onClick={() => window.open(link.url, '_blank', 'width=600,height=400')}
        >
          <link.icon className="w-4 h-4 mr-1.5" />
          {link.name}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
      >
        <LinkIcon className="w-4 h-4 mr-1.5" />
        Copy Link
      </Button>
    </div>
  );
};

export default ShareButtons;
