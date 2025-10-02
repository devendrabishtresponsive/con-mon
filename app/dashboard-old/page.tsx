'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {

  //   const [user, setUser] = useState<any>(null);

  //   useEffect(() => {
  //       fetch('/api/user')
  //       .then(res => res.json())
  //       .then(data => {
  //           if (data.isLoggedIn) {
  //           setUser(data.user);
  //           }
  //       });
  //   }, []);

  //   return (
  //   <div>
  //     <h1>Dashboard</h1>
  //     {user ? (
  //       <div>
  //         <p>Welcome, {user.name}</p>
  //         <img src={user.picture} alt={user.name} width={50} />
  //       </div>
  //     ) : (
  //       <p>Please log in.</p>
  //     )}
  //   </div>
  // );


    const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; picture: string } | null>(null);
    const router = useRouter();
    
    
    // const [accessToken, setAccessToken] = useState<string | null>(null);
    // const [accounts, setAccounts] = useState<any[]>([]);
    // const [accountSummaries, setAccountSummaries] = useState<any[]>([]);
    // const [property, setProperty] = useState({});

    // const fetchAccounts = async () => {
    //     // if (!accessToken) return
    //     try {
    //         // const res = await axios.get(
    //         //     'https://analyticsadmin.googleapis.com/v1beta/accounts',
    //         //     {
    //         //         headers: {
    //         //             Authorization: `Bearer ${accessToken}`,
    //         //         },
    //         //     }
    //         // )
    //         // // console.log(res.data)
    //         // setAccounts(res.data.accounts || [])
    //         const accountsResponse = await fetch(
    //             'https://analyticsadmin.googleapis.com/v1beta/accounts',
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${user.accessToken}!`,
    //                 },
    //             }
    //         );
    //         const accountsData = await accountsResponse.json();
            
    //         if ( accountsData.error ) {
    //             const error = accountsData.error;
    //             console.log(error);
    //             throw new Error(`Error Details: code: ${error.code} | message: ${error.message} | status: ${error.status}`);
    //         }
    //         // console.log(accountsData);
    //     } catch (error) {
    //         console.error('API error:', error)
    //     }
        
    // }

    
    
    useEffect(() => {
        const cm_loggedInUser = localStorage.getItem('cm_loggedInUser');
        console.log(cm_loggedInUser);

        if (!cm_loggedInUser) {
            router.push('/');
        }
        if (cm_loggedInUser) {
            try {
                setLoggedInUser(JSON.parse(cm_loggedInUser));
            } catch {
                localStorage.removeItem('cm_loggedInUser');
            }
        }
    }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const stored = localStorage.getItem('googleUser');
    //         console.log(stored);

    //         // Use await with cookies()
    //         const cookieStore = await cookies();
    //         const token = cookieStore.get('ga_access_token')?.value;
    //         console.log(token);

    //         if (!stored) {
    //             router.push('/');
    //         }
    //         if (stored) {
    //             try {
    //                 setUser(JSON.parse(stored));
    //             } catch {
    //                 localStorage.removeItem('googleUser');
    //             }
    //         }
    //     };
    //     fetchData();
    // }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('cm_loggedInUser');
        router.push('/');
    };

    // const fetchAccounts = async () => {
    //     try {
    //         // Exchange code for access token
    //         const tokenRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {
    //             // method: 'GET',
    //             headers: { 
    //                 Authorization: `Bearer ${accessToken}`,
    //                 // 'Content-Type': 'application/json',
    //             },
    //             // body: new URLSearchParams({
    //             //     code,
    //             //     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    //             //     client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    //             //     redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
    //             //     grant_type: 'authorization_code',
    //             // }),
    //         });
            
    //         const tokenData = await tokenRes.json();
            
    //         // Use access token to get user info
    //         const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    //             headers: {
    //                 Authorization: `Bearer ${tokenData.access_token}`,
    //             },
    //         });
            
    //         // const user = await userRes.json();
    //         // const dashboardUrl = new URL('/dashboard', req.nextUrl.origin);
    //         // dashboardUrl.searchParams.set('name', user.name);
    //         // dashboardUrl.searchParams.set('email', user.email);
    //         // dashboardUrl.searchParams.set('picture', user.picture);
    //         // return NextResponse.redirect(dashboardUrl.toString());
            
    //         const user = await userRes.json();
    //         // Redirect to /auth/saveuser with query params
    //         const saveUrl = new URL('/auth/saveuser', req.nextUrl.origin);
    //         saveUrl.searchParams.set('name', user.name);
    //         saveUrl.searchParams.set('email', user.email);
    //         saveUrl.searchParams.set('picture', user.picture);
    //         return NextResponse.redirect(saveUrl.toString());
    //     } catch (err) {
    //         console.error(err);
    //         // return NextResponse.redirect('/');
    //     }
    // }
    
    
//     const fetchAccounts = async () => {
//         if (!accessToken) return
//         try {
//             const res = await axios.get(
//                 'https://analyticsadmin.googleapis.com/v1beta/accounts',
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                     },
//                 }
//             )
//             // console.log(res.data)
//             setAccounts(res.data.accounts || [])
//         } catch (error) {
//             console.error('API error:', error)
//         }
//     }
    
//     const fetchAccountSummaries = async () => {
//         if (!accessToken) return
//         try {
//             const res = await axios.get(
// 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                     },
//                 }
//             )
//             // console.log(res.data)
//             setAccountSummaries(res.data.accountSummaries || [])
//         } catch (error) {
//             console.error('API error:', error)
//         }
//     }
    
//     const fetchProperty = async ( property ) => {
//         if (!accessToken) return
//         try {
//             const res = await axios.get(
// `https://analyticsadmin.googleapis.com/v1beta/${property}/`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                     },
//                 }
//             )
//             // console.log(res.data)
//             setProperty(res.data || [])
//         } catch (error) {
//             console.error('API error:', error)
//         }
//     }
    
    return (
        <main style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            {loggedInUser ? (
                <>
                    <p>Name: {loggedInUser.name}</p>
                    <p>Email: {loggedInUser.email}</p>
                    <img src={loggedInUser.picture} alt="Profile" width={100} />
                    <br />
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>

                    {/* <button
                        onClick={fetchAccounts}
                        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
                    >
                        Fetch GA4 Accounts
                    </button> */}

                    {/* <button
                        onClick={fetchAccounts}
                        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
                    >
                        Fetch GA4 Accounts
                    </button>

                    <button
                        onClick={fetchAccountSummaries}
                        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
                    >
                        Fetch GA4 Account Summaries
                    </button> */}
                </>
            ) : (
                <p>Loading loggedInUser...</p>
            )}
        </main>
    );
}