import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">About DCLink</h1>
          <p className="mt-5 text-xl text-gray-500">Connecting alumni to unlock new opportunities</p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Platform</h2>
          <p className="mt-4 text-lg text-gray-500">
            DCLink is an innovative platform designed to connect Disha College alumni, enabling them to interact, network, and unlock new opportunities. Our goal is to foster a strong community of professionals who can support each other's growth, share experiences, and collaborate on exciting projects.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900">Key Features</h2>
          <ul className="mt-4 text-lg text-gray-500 list-disc list-inside space-y-2">
            <li>Alumni Directory: Easily find and connect with fellow Disha College graduates</li>
            <li>Job Board: Exclusive job postings and career opportunities shared by alumni</li>
            <li>Mentorship Program: Connect with experienced professionals for guidance and support</li>
            <li>Events Calendar: Stay updated on alumni meetups, webinars, and networking events</li>
            <li>Discussion Forums: Engage in meaningful conversations and knowledge sharing</li>
          </ul>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900">About Disha College</h2>
          <div className="mt-6 aspect-w-16 aspect-h-9">
            <Image 
              src="/images/dc.jpg" 
              alt="Disha College Campus" 
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-lg"
            />
          </div>
          <p className="mt-4 text-lg text-gray-500">
            Located in Raipur, Chhattisgarh, Disha College is managed by Disha Education Society. Founded by Shri S.K Jain, our institution is committed to promoting quality education with the motto "Learning with Conscience". We offer various courses affiliated with Pt. Ravishankar Shukla University, aiming to build future leaders through meaningful and conscientious learning. DCLink extends this mission by supporting our alumni in their professional journeys.
          </p>
        </div>

        <div className="mt-16 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Building 1, First Floor, Ram Nagar - Kota Marg, Behind NIT and Hotel Piccadilly, Raipur - 492003</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0771-4349400</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">principal.dishacollege@dishamail.com</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

