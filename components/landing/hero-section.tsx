import Link from "next/link";
import { Button } from "../ui/button";
import { Heart, Share2, TrendingUp, Users, Target, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-10 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span>Powered by Cardano</span>
          </div>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl text-slate-900">
                World's <span className="text-indigo-600">Funding</span> Platform
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed md:text-xl max-w-2xl">
                We started with the radical idea that anyone, anywhere, should be able to easily and securely fund their dreams. Today, we offer a decentralized, trusted and easy-to-use platform for crowdfunding across the world.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link href="/campaigns/create">
                <Button 
                  size="lg" 
                  className="w-full min-[400px]:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
                >
                  Start a Campaign
                </Button>
              </Link>
              <Link href="/discover">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[400px]:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-lg"
                >
                  Discover Campaigns
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">10K+</div>
                <div className="text-sm text-slate-600">Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">$2M+</div>
                <div className="text-sm text-slate-600">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-600">Backers</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Blue selection box */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-blue-400 border-dashed rounded-lg" 
                   style={{
                     width: 'calc(100% + 32px)',
                     height: 'calc(100% + 32px)'
                   }}>
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-sm"></div>
              </div>
              
              {/* Main illustration container */}
              <div className="relative bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 rounded-2xl p-8 shadow-xl">
                
                {/* Hanging lamps */}
                <div className="absolute top-0 left-8 w-12 h-6 bg-slate-800 rounded-b-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-slate-800 rounded-b-full"></div>
                <div className="absolute top-0 right-8 w-12 h-6 bg-slate-800 rounded-b-full"></div>
                
                {/* Characters */}
                <div className="flex items-center justify-between h-64 relative">
                  
                  {/* Left character - Woman */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="w-12 h-20 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-t-lg"></div>
                    <div className="w-16 h-16 bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-lg"></div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-8 bg-slate-800 rounded"></div>
                      <div className="w-3 h-8 bg-slate-800 rounded"></div>
                    </div>
                  </div>

                  {/* Center character - Person at desk */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="w-12 h-20 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-t-lg"></div>
                    <div className="w-20 h-12 bg-slate-700 rounded-lg relative">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-slate-900 rounded"></div>
                    </div>
                    <div className="w-6 h-16 bg-slate-600 rounded"></div>
                  </div>

                  {/* Right character - Man */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="w-12 h-20 bg-gradient-to-b from-green-500 to-green-700 rounded-t-lg"></div>
                    <div className="w-16 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg"></div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-8 bg-slate-800 rounded"></div>
                      <div className="w-3 h-8 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Plants */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-8 h-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-8 bg-green-500 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-2 h-4 bg-green-600 rounded-full"></div>
                    <div className="absolute top-1 right-1 w-2 h-4 bg-green-600 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-12 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    <div className="absolute -top-2 left-0 w-3 h-4 bg-green-600 rounded-full transform rotate-12"></div>
                    <div className="absolute -top-2 right-0 w-3 h-4 bg-green-600 rounded-full transform -rotate-12"></div>
                  </div>
                </div>

                {/* Floating dashboard element */}
                <div className="absolute top-12 right-2 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-8 h-1 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1 h-6 bg-blue-500 rounded"></div>
                    <div className="w-1 h-4 bg-blue-300 rounded"></div>
                    <div className="w-1 h-8 bg-blue-600 rounded"></div>
                    <div className="w-1 h-3 bg-blue-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">How BackerBoost Works</h3>
            <p className="text-slate-600">Simple, transparent, and secure crowdfunding in three steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Create a Campaign</h4>
              <p className="text-slate-600">Set your goal, deadline, and share your story with the world</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Receive Support</h4>
              <p className="text-slate-600">Contributors can fund your dreams without any authentication required</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Unlock Funds</h4>
              <p className="text-slate-600">Funds remain locked until your target date or goal is achieved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;