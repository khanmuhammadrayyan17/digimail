'use client';
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center px-4">
        <style jsx>{`
          .gsi-material-button {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -webkit-appearance: none;
            background-color: WHITE;
            background-image: none;
            border: 1px solid #dadce0;
            -webkit-border-radius: 8px;
            border-radius: 8px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #3c4043;
            cursor: pointer;
            font-family: 'Google Sans', 'Roboto', arial, sans-serif;
            font-size: 16px;
            font-weight: 500;
            height: 48px;
            letter-spacing: 0.25px;
            outline: none;
            overflow: hidden;
            padding: 0 16px;
            position: relative;
            text-align: center;
            -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
            transition: background-color .218s, border-color .218s, box-shadow .218s;
            vertical-align: middle;
            white-space: nowrap;
            width: auto;
            max-width: 320px;
            min-width: 280px;
          }

          .gsi-material-button .gsi-material-button-icon {
            height: 20px;
            margin-right: 12px;
            min-width: 20px;
            width: 20px;
          }

          .gsi-material-button .gsi-material-button-content-wrapper {
            -webkit-align-items: center;
            align-items: center;
            display: flex;
            -webkit-flex-direction: row;
            flex-direction: row;
            -webkit-flex-wrap: nowrap;
            flex-wrap: nowrap;
            height: 100%;
            justify-content: center;
            position: relative;
            width: 100%;
          }

          .gsi-material-button .gsi-material-button-contents {
            -webkit-flex-grow: 1;
            flex-grow: 1;
            font-family: 'Google Sans', 'Roboto', arial, sans-serif;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: top;
          }

          .gsi-material-button .gsi-material-button-state {
            -webkit-transition: opacity .218s;
            transition: opacity .218s;
            bottom: 0;
            left: 0;
            opacity: 0;
            position: absolute;
            right: 0;
            top: 0;
          }

          .gsi-material-button:disabled {
            cursor: default;
            background-color: #ffffff61;
            border-color: #1f1f1f1f;
          }

          .gsi-material-button:disabled .gsi-material-button-contents {
            opacity: 38%;
          }

          .gsi-material-button:disabled .gsi-material-button-icon {
            opacity: 38%;
          }

          .gsi-material-button:not(:disabled):active .gsi-material-button-state, 
          .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
            background-color: #303030;
            opacity: 12%;
          }

          .gsi-material-button:not(:disabled):hover {
            -webkit-box-shadow: 0 2px 4px 0 rgba(60, 64, 67, .30), 0 1px 6px 0 rgba(60, 64, 67, .15);
            box-shadow: 0 2px 4px 0 rgba(60, 64, 67, .30), 0 1px 6px 0 rgba(60, 64, 67, .15);
            border-color: #dadce0;
          }

          .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
            background-color: #303030;
            opacity: 8%;
          }

          .gsi-material-button:not(:disabled):focus {
            border-color: #4285f4;
            outline: 2px solid transparent;
            outline-offset: 2px;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }

          .logo-container {
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
          }
        `}</style>
        
        {/* Logo/Brand Section */}
        <div className="logo-container fade-in-up">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              📧
            </div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              margin: '0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              DigiMail
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '48px 40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Welcome Back
            </h2>
            <p style={{ 
              color: '#718096', 
              fontSize: '16px',
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>
              Sign in to access your AI-powered email dashboard
            </p>
            
            <button 
              className="gsi-material-button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              style={{ width: '100%' }}
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: 'block'}}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">Continue with Google</span>
              </div>
            </button>
            
            <div style={{ 
              marginTop: '24px', 
              padding: '16px',
              backgroundColor: '#f7fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#4a5568',
                margin: '0',
                lineHeight: '1.5'
              }}>
                🔒 Your data is secure and private. We only access your email metadata to provide AI-powered insights.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fade-in-up" style={{ 
          marginTop: '40px', 
          textAlign: 'center',
          animationDelay: '0.4s'
        }}>
          <p style={{ 
            color: '#718096', 
            fontSize: '14px',
            margin: '0'
          }}>
            Powered by AI • Built with ❤️
          </p>
        </div>
      </div>
  );
}
