import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  Trophy, 
  Calendar, 
  Github, 
  Twitter, 
  Mail, 
  MessageSquare, 
  User,
  Bookmark,
  Settings,
  Heart,
  Award
} from 'lucide-react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    username: 'alexj',
    email: 'alex.johnson@example.com',
    bio: 'Product designer and developer focused on creating meaningful digital experiences. Passionate about accessibility and ethical design.',
    avatarUrl: 'https://i.pravatar.cc/300?img=12',
    coverUrl: 'https://images.unsplash.com/photo-1614849286521-4c58b2f0ff15?q=80&w=1000',
    location: 'San Francisco, CA',
    twitter: 'alexjohnson',
    github: 'alexj-dev',
    website: 'alexjohnson.design'
  });

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Used the app for 7 consecutive days', completed: true, icon: Calendar, progress: 100 },
    { id: 2, title: 'Task Master', description: 'Completed 50 tasks', completed: true, icon: Trophy, progress: 100 },
    { id: 3, title: 'Early Riser', description: 'Completed morning routine 5 times', completed: true, icon: Award, progress: 100 },
    { id: 4, title: 'Focus Champion', description: 'Accumulated 10 hours of focus time', completed: false, icon: Trophy, progress: 75 },
    { id: 5, title: 'Hydration Hero', description: 'Tracked water intake for 14 days', completed: false, icon: Award, progress: 60 }
  ];

  const stats = [
    { label: 'Tasks Completed', value: 128 },
    { label: 'Habits Tracked', value: 8 },
    { label: 'Current Streak', value: '12 days' },
    { label: 'Focus Hours', value: '32h' }
  ];

  const handleSocialMediaClick = (platform: string, username: string) => {
    let url;
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/${username}`;
        break;
      case 'github':
        url = `https://github.com/${username}`;
        break;
      case 'email':
        url = `mailto:${username}`;
        break;
      case 'website':
        if (!username.startsWith('http')) {
          url = `https://${username}`;
        } else {
          url = username;
        }
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
  };

  const handleSaveProfile = (formData: typeof profileData) => {
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden border-none shadow-none">
        {/* Cover Image */}
        <div 
          className="h-48 w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${profileData.coverUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        
        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 lg:px-8 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <Avatar className="size-24 border-4 border-background">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">@{profileData.username}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {!isEditing && (
                <EditProfileDialog 
                  profileData={profileData} 
                  onSave={handleSaveProfile}
                />
              )}
              
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={() => handleSocialMediaClick('twitter', profileData.twitter)}
                >
                  <Twitter className="size-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => handleSocialMediaClick('github', profileData.github)}
                >
                  <Github className="size-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => handleSocialMediaClick('email', profileData.email)}
                >
                  <Mail className="size-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mt-6 mb-2">
            <p className="text-muted-foreground">{profileData.bio}</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            {stats.map((stat, i) => (
              <Card key={i} className="text-center p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${achievement.completed ? 'bg-primary/20' : 'bg-muted'}`}>
                        <achievement.icon className={`size-4 ${achievement.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <CardTitle className="text-base">{achievement.title}</CardTitle>
                    </div>
                    {achievement.completed && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Completed</Badge>
                    )}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!achievement.completed && (
                    <>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: "Completed task", target: "Create project wireframes", time: "2 hours ago", icon: Trophy },
                { action: "Started habit", target: "Daily meditation", time: "Yesterday", icon: Calendar },
                { action: "Reached goal", target: "Read for 30 minutes", time: "2 days ago", icon: Award },
                { action: "Tracked mood", target: "Feeling productive", time: "3 days ago", icon: Heart },
                { action: "Completed task", target: "Team standup meeting", time: "3 days ago", icon: Trophy }
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="bg-muted rounded-full p-2">
                    <activity.icon className="size-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}: {activity.target}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="friends" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Friends & Connections</span>
                <Button size="sm" variant="outline">Find Friends</Button>
              </CardTitle>
              <CardDescription>People you connect with on LifeTrackPro</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Sarah Chen", username: "sarahc", avatarUrl: "https://i.pravatar.cc/150?img=5", mutualFriends: 3 },
                { name: "Michael Rodriguez", username: "mrodriguez", avatarUrl: "https://i.pravatar.cc/150?img=8", mutualFriends: 5 },
                { name: "Jamie Wilson", username: "jwilson", avatarUrl: "https://i.pravatar.cc/150?img=10", mutualFriends: 2 },
                { name: "Taylor Kim", username: "tkim", avatarUrl: "https://i.pravatar.cc/150?img=15", mutualFriends: 4 },
                { name: "Jordan Patel", username: "jpatel", avatarUrl: "https://i.pravatar.cc/150?img=20", mutualFriends: 1 }
              ].map((friend, i) => (
                <Card key={i} className="overflow-hidden border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">@{friend.username}</p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Badge variant="outline" className="text-xs">
                        {friend.mutualFriends} mutual friends
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="size-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Edit Profile Dialog Component
function EditProfileDialog({ 
  profileData, 
  onSave 
}: { 
  profileData: {
    name: string;
    username: string;
    email: string;
    bio: string;
    avatarUrl: string;
    coverUrl: string;
    location: string;
    twitter: string;
    github: string;
    website: string;
  }; 
  onSave: (data: typeof profileData) => void;
}) {
  const [formData, setFormData] = useState(profileData);
  const [open, setOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="size-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="avatarUrl" 
                  name="avatarUrl" 
                  value={formData.avatarUrl} 
                  onChange={handleInputChange} 
                  placeholder="Image URL or upload a photo"
                />
                <div className="relative">
                  <Input
                    type="file"
                    id="avatar-upload"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload this to a server
                        // For demo purposes, we'll create a local URL
                        const localUrl = URL.createObjectURL(file);
                        setFormData({
                          ...formData,
                          avatarUrl: localUrl
                        });
                      }
                    }}
                  />
                  <Button type="button" variant="outline" className="w-full">
                    Upload
                  </Button>
                </div>
              </div>
              {formData.avatarUrl && (
                <div className="mt-2">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={formData.avatarUrl} alt="Preview" />
                    <AvatarFallback>{formData.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverUrl">Cover Image</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="coverUrl" 
                  name="coverUrl" 
                  value={formData.coverUrl} 
                  onChange={handleInputChange}
                  placeholder="Image URL or upload a photo"
                />
                <div className="relative">
                  <Input
                    type="file"
                    id="cover-upload"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const localUrl = URL.createObjectURL(file);
                        setFormData({
                          ...formData,
                          coverUrl: localUrl
                        });
                      }
                    }}
                  />
                  <Button type="button" variant="outline" className="w-full">
                    Upload
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={formData.bio} 
                onChange={handleInputChange} 
                rows={3} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter Username</Label>
              <Input 
                id="twitter" 
                name="twitter" 
                value={formData.twitter} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Username</Label>
              <Input 
                id="github" 
                name="github" 
                value={formData.github} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website" 
                value={formData.website} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 