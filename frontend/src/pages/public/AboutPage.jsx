import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Users, Award, Globe, Target, CheckCircle2
} from 'lucide-react';

const AboutPage = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    axios.get(`${API}/team`).then(res => setTeam(res.data)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif max-w-3xl">
              Going the Extra Mile Since 1998
            </h1>
            <p className="text-white/80 max-w-2xl">
              DataVision International is headquartered in Dar es Salaam with a global reach, 
              offering professional consulting services in Data Analytics, Research & Statistics, 
              Technology Solutions, and Professional Training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6 font-serif">Our Story</h2>
              <p className="text-[#64748b] mb-4">
                Founded in 1998, DataVision International is an outcome of the recognition that sustainable 
                development can be accelerated by providing requirement-driven, data-focused solutions.
              </p>
              <p className="text-[#64748b] mb-4">
                Since its establishment, the company has been fast growing in terms of delivery of 
                services and customer base across Africa and globally. The best part of our history includes our ability to 
                adapt to the fast-changing demands of our clients.
              </p>
              <p className="text-[#64748b]">
                We work with a "Customer First, Open Mind" philosophy. This relates to our 
                implementation process which makes our clients an integral part of the project 
                to ensure effective capacity building and transfer of the deliverables.
              </p>
            </div>
            <div className="bg-[#f8fafc] p-8">
              <h3 className="text-xl font-bold text-[#0a1628] mb-6 font-serif">Our Values</h3>
              <div className="space-y-4">
                {[
                  { title: 'Excellence', desc: 'Delivering the highest quality in everything we do' },
                  { title: 'Integrity', desc: 'Maintaining ethical standards and transparency' },
                  { title: 'Innovation', desc: 'Embracing modern technologies and methodologies' },
                  { title: 'Partnership', desc: 'Building lasting relationships with our clients' },
                ].map((value, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#0a1628]">{value.title}</h4>
                      <p className="text-sm text-[#64748b]">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-2">Leadership</p>
            <h2 className="text-3xl font-bold text-[#0a1628] font-serif">Our Team</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all"
              >
                <div className="w-20 h-20 bg-[#0a1628] rounded-full mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] font-serif">{member.name}</h3>
                <p className="text-[#e63946] text-sm font-semibold mb-2">{member.position}</p>
                <p className="text-[#64748b] text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Research & Statistics Page (Main Focus)

export default AboutPage;
