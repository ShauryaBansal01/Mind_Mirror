import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  BarChart3, 
  Shield, 
  Zap, 
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Users
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI detects cognitive distortions in your journal entries and provides evidence-based reframes.',
      color: 'text-primary-600 bg-primary-50'
    },
    {
      icon: BookOpen,
      title: 'Secure Journaling',
      description: 'Write freely in a safe, encrypted environment designed for mental wellness and self-reflection.',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: BarChart3,
      title: 'Mood Analytics',
      description: 'Track your emotional patterns over time with beautiful visualizations and insights.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your thoughts are yours alone. We use end-to-end encryption to keep your data secure.',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Get immediate feedback on your thoughts with personalized suggestions for healthier thinking.',
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      icon: Heart,
      title: 'Mental Wellness',
      description: 'Built on proven CBT principles to support your journey toward better mental health.',
      color: 'text-red-600 bg-red-50'
    }
  ];

  const benefits = [
    'Identify negative thought patterns automatically',
    'Learn healthier ways to reframe your thoughts',
    'Track your emotional progress over time',
    'Build self-awareness through guided reflection',
    'Access your journal anywhere, anytime',
    'Keep your thoughts completely private and secure'
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Mental Health Advocate',
      content: 'MindMirror helped me recognize patterns I never noticed before. The AI insights are incredibly helpful.',
      rating: 5
    },
    {
      name: 'David L.',
      role: 'Therapist',
      content: 'I recommend MindMirror to my clients. It\'s like having a CBT coach available 24/7.',
      rating: 5
    },
    {
      name: 'Emma R.',
      role: 'Student',
      content: 'The mood tracking feature helped me understand my stress patterns during exam season.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Transform Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Mental Wellness
                </span>
                {' '}Journey
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                MindMirror uses AI to help you identify cognitive distortions, reframe negative thoughts, 
                and build healthier thinking patterns through intelligent journaling.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button as={Link} to="/register" size="lg" className="w-full sm:w-auto">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>10,000+ users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>100% secure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to understand your thoughts, emotions, and build healthier mental habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MindMirror Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to transform your mental wellness journey with AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Write Your Thoughts
                  </h3>
                  <p className="text-gray-600">
                    Express yourself freely in our secure, private journaling environment. 
                    Write about your day, feelings, or any thoughts on your mind.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our advanced AI analyzes your entries to identify cognitive distortions 
                    and negative thought patterns using proven CBT principles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Get Insights & Reframes
                  </h3>
                  <p className="text-gray-600">
                    Receive personalized suggestions for reframing negative thoughts 
                    into more balanced, realistic perspectives.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600">
                    Monitor your emotional patterns and mental wellness journey 
                    with beautiful analytics and progress tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Your Journey Today
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of users who have transformed their mental wellness 
                    with MindMirror's AI-powered insights.
                  </p>
                  <Button as={Link} to="/register" size="lg" className="w-full">
                    Get Started Free
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose MindMirror?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Built by mental health professionals and AI experts, MindMirror combines 
                the latest technology with proven therapeutic techniques.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-gray-600">Journal Entries</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">AI Support</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from people who have transformed their mental wellness with MindMirror.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Mental Wellness?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who have already started their journey to better mental health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                as={Link} 
                to="/register" 
                variant="secondary" 
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-50"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;