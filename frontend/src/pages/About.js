import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 via-orange-400 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">The Idea Behind Average2Epic</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Main Story */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <p className="text-2xl text-slate-700 leading-relaxed mb-8">
            Average2Epic began as a personal 100-day challenge — to become consistent, conscious, and creative.
          </p>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            It's not about chasing perfection; it's about showing up. Every day.
          </p>
          <p className="text-xl text-slate-600 leading-relaxed">
            And perhaps, inspiring a few others to do the same.
          </p>
        </div>

        {/* Image Section */}
        <div className="mb-12">
          <img
            src="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHxkaXNjaXBsaW5lfGVufDB8fHx8MTc2MDg3MDM4Nnww&ixlib=rb-4.1.0&q=85"
            alt="Difficult roads lead to beautiful destinations"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>

        {/* Philosophy */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">The Challenge</h3>
            <p className="text-slate-600 leading-relaxed">
              One hundred days of consistent action. No excuses. No shortcuts. 
              Just the raw commitment to become better than yesterday.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">The Purpose</h3>
            <p className="text-slate-600 leading-relaxed">
              To prove that transformation isn't reserved for the lucky or talented. 
              It's available to anyone willing to show up.
            </p>
          </div>
        </div>

        {/* Portrait and Signature */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-center">
          <div className="mb-8">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw0fHxzZWxmJTIwaW1wcm92ZW1lbnR8ZW58MHx8fHwxNzYwODcwMzgyfDA&ixlib=rb-4.1.0&q=85"
              alt="Meditation and discipline"
              className="w-64 h-64 object-cover rounded-full mx-auto shadow-xl"
            />
          </div>
          <p className="text-xl text-slate-600 italic mb-4">
            "Every day is a chance to choose epic over average."
          </p>
          <p className="text-2xl font-bold text-slate-900">— Average2Epic Journey</p>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center">What This Journey Taught Me</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl p-6">
              <h4 className="text-xl font-bold mb-2">Consistency Beats Intensity</h4>
              <p className="opacity-90">
                Showing up every day, even at 60%, beats going all-in once a week.
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
              <h4 className="text-xl font-bold mb-2">Discipline Is Freedom</h4>
              <p className="opacity-90">
                The structure of daily habits creates space for creativity and growth.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6">
              <h4 className="text-xl font-bold mb-2">Belief Precedes Achievement</h4>
              <p className="opacity-90">
                You have to believe you can change before the evidence arrives.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-slate-900">
            Ready to start your own journey?
          </h3>
          <Link to="/videos">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
              Watch the Transformation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;