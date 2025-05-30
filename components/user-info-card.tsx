import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  User, 
  CreditCard, 
  Settings, 
  LogOut,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UserData {
  id: string;
  name?: string;
  email?: string;
  role: string;
  walletAddress: string;
  balance?: string;
  isVerified?: boolean;
  memberSince?: string;
}

const UserInfoCard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Mock function - replace with your actual data fetching logic
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with your actual data source
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual user data
        const mockUserData: UserData = {
          id: "user_123456",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Creator",
          walletAddress: "addr1qx2f...a8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2",
          balance: "1,234.56 ADA",
          isVerified: true,
          memberSince: "January 2024"
        };
        
        setUserData(mockUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const truncateAddress = (address: string, chars = 8) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-muted animate-pulse rounded" />
            <div className="w-24 h-5 bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="w-full h-4 bg-muted animate-pulse rounded" />
            <div className="w-3/4 h-4 bg-muted animate-pulse rounded" />
            <div className="w-1/2 h-4 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Unable to load user data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Account Info</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User Profile Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Name</span>
            <span className="text-sm text-muted-foreground">
              {userData.name || 'Not set'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Role</span>
            <Badge variant="secondary">{userData.role}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <div className="flex items-center space-x-1">
              {userData.isVerified ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Pending</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Member Since</span>
            <span className="text-sm text-muted-foreground">
              {userData.memberSince}
            </span>
          </div>
        </div>

        <Separator />

        {/* Wallet Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">Wallet</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Address</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1"
                onClick={() => copyToClipboard(userData.walletAddress)}
              >
                {copiedAddress ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
            <div className="text-xs font-mono bg-muted p-2 rounded break-all">
              {truncateAddress(userData.walletAddress, 12)}
            </div>
          </div>

          {userData.balance && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Balance</span>
              <span className="text-sm font-semibold text-primary">
                {userData.balance}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full" size="sm">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Methods
          </Button>
          
          <Button variant="outline" className="w-full" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
          
          <Button variant="outline" className="w-full text-destructive hover:text-destructive" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;