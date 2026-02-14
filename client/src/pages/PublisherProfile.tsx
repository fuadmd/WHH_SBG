import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Project, AppState } from '../types';
import { UI_STRINGS } from '../constants';

interface PublisherProfileProps {
  state: AppState;
  users: User[];
  projects: Project[];
}

const PublisherProfile: React.FC<PublisherProfileProps> = ({ state, users, projects }) => {
  const { publisherId } = useParams<{ publisherId: string }>();
  const navigate = useNavigate();
  const t = UI_STRINGS[state.language];

  const publisher = users.find(u => u.id === publisherId);
  const publisherProjects = projects.filter(p => p.ownerName === publisher?.name);

  if (!publisher) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <h1 className={`text-2xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {'Not Found'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {'Back'}
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = publisher.role === 'ADMIN';
  const isBeneficiary = publisher.role === 'BENEFICIARY';
  const isViewer = publisher.role === 'VIEWER';

  return (
    <div className={`min-h-screen ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 px-4 py-2 rounded-lg font-medium transition ${
            state.theme === 'dark'
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          ← Back
        </button>

        {/* Profile Header */}
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 mb-8`}>
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {publisher.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-grow">
              <h1 className={`text-3xl font-bold mb-2 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {publisher.name}
              </h1>

              {/* Role Badge */}
              <div className="flex gap-2 mb-4">
                {isAdmin && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {state.language === 'AR' ? 'مسؤول' : 'Administrator'}
                  </span>
                )}
                {isBeneficiary && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {state.language === 'AR' ? 'بائع' : 'Seller'}
                  </span>
                )}
                {isViewer && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {state.language === 'AR' ? 'زائر' : 'Visitor'}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="mb-2">
                  <span className="font-semibold">{state.language === 'AR' ? 'البريد الإلكتروني:' : 'Email:'}</span> {publisher.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Information */}
        {isAdmin && (
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 mb-8`}>
            <h2 className={`text-2xl font-bold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {state.language === 'AR' ? 'معلومات الإدارة' : 'Administration Information'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-sm font-semibold ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {state.language === 'AR' ? 'الصلاحيات' : 'Permissions'}
                </p>
                <p className={`text-lg font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {publisher.adminPermission || 'N/A'}
                </p>
              </div>

              <div>
                <p className={`text-sm font-semibold ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {state.language === 'AR' ? 'حالة الحساب' : 'Account Status'}
                </p>
                <p className={`text-lg font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {state.language === 'AR' ? 'نشط' : 'Active'}
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
              <h3 className={`text-lg font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {state.language === 'AR' ? 'التواصل' : 'Contact'}
              </h3>
              <div className="flex gap-4">
                <a
                  href={`mailto:${publisher.email}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {state.language === 'AR' ? 'إرسال بريد' : 'Send Email'}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Beneficiary/Seller Information */}
        {isBeneficiary && (
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 mb-8`}>
            <h2 className={`text-2xl font-bold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {state.language === 'AR' ? 'متجر البائع' : 'Seller Store'}
            </h2>

            {publisherProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publisherProjects.map(project => (
                  <div
                    key={project.id}
                    className={`${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 cursor-pointer hover:shadow-lg transition`}
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <h3 className={`text-lg font-bold mb-2 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {project.name}
                    </h3>
                    <p className={`text-sm mb-3 ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.category}
                      </span>
                      <span className="text-yellow-500">★ {project.rating}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center py-8 ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {state.language === 'AR' ? 'لا توجد متاجر متاحة' : 'No stores available'}
              </p>
            )}

            {/* Contact Section */}
            <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
              <h3 className={`text-lg font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {state.language === 'AR' ? 'التواصل' : 'Contact'}
              </h3>
              <div className="flex gap-4">
                <a
                  href={`mailto:${publisher.email}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {state.language === 'AR' ? 'إرسال بريد' : 'Send Email'}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Visitor Information */}
        {isViewer && (
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 mb-8`}>
            <h2 className={`text-2xl font-bold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {state.language === 'AR' ? 'معلومات الزائر' : 'Visitor Information'}
            </h2>

            <div className={`p-6 rounded-lg ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {state.language === 'AR'
                  ? 'هذا المستخدم زائر في المنصة. يمكنك التواصل معه عبر البريد الإلكتروني.'
                  : 'This user is a visitor on the platform. You can contact them via email.'}
              </p>
            </div>

            {/* Contact Section */}
            <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
              <h3 className={`text-lg font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {state.language === 'AR' ? 'التواصل' : 'Contact'}
              </h3>
              <div className="flex gap-4">
                <a
                  href={`mailto:${publisher.email}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {state.language === 'AR' ? 'إرسال بريد' : 'Send Email'}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherProfile;
