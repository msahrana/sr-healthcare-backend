//=====================================start
// if (!refreshTokenResponse.ok) {
//                 throw new AppError(httpStatus.BAD_GATEWAY, 'Bkash Access Token Grant Failed');
//             }
//=====================================end

//=====================================start
// if (!response.ok) {
//             throw new AppError(httpStatus.BAD_GATEWAY, 'BKash Access Token Grant Failed!');
//         }
//=====================================end

//=====================================start
// catch (error: any) {
//         throw new AppError(
//             error instanceof AppError ? error.statusCode : httpStatus.INTERNAL_SERVER_ERROR,
//             error.message,
//         );
//=====================================end

//=====================================start
// if (!token) {
//                 throw new AppError(
//                     httpStatus.UNAUTHORIZED,
//                     'You are not logged in. Please log in to access this resource.',
//                 );
//             }
//=====================================end

//=====================================start
// if (!verifiedToken.success) {
//                 throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
//             }
//=====================================end

//=====================================start
// if (requiredRoles.length && !requiredRoles.includes(role)) {
//                 throw new AppError(
//                     httpStatus.FORBIDDEN,
//                     "Forbidden. You don't have permission to access this resource.",
//                 );
//             }
//=====================================end

//=====================================start
// if (!user) {
//                 throw new AppError(httpStatus.UNAUTHORIZED, 'User not found. Please log in again.');
//             }
//=====================================end

//=====================================start
// if (user.status === 'BLOCKED') {
//                 throw new AppError(
//                     httpStatus.FORBIDDEN,
//                     'Your account has been blocked. Please contact support.',
//                 );
//             }
//=====================================end

//=====================================start
// if (!result.success) {
//     console.log(result.error);
//     console.log(result.error.issues);

//     throw new AppError(httpStatus.BAD_REQUEST, result.error.issues[0].message);
// }
//=====================================end

//=====================================start
// if (!name || !email || !password) {
//             throw new AppError(
//                 httpStatus.INTERNAL_SERVER_ERROR,
//                 'Super Admin Name , Email, Password Missing In Env File!!!',
//             );
//         }
//=====================================end

//=====================================start
// const bkashIdToken = await getBKashIdToken();

//         if (!bkashIdToken) {
//             throw new AppError(httpStatus.BAD_GATEWAY, 'No Bkash Access Token Found!');
//         }
//=====================================end

//=====================================start
// const existingAppointment = await prisma.appointment.findUnique({
//         where: {
//             id: appointmentId,
//         },
//     });

//     if (!existingAppointment) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Appointment Does Not Exists');
//     }

//     if (existingAppointment.status !== 'PENDING') {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Appointment Is Not Pending! Only PENDING Status Can Pay.',
//         );
//     }
//=====================================end

//=====================================start
// const existingAppointment = await tx.appointment.findUnique({
//             where: {
//                 id: appointmentId,
//             },
//             include: {
//                 payment: true,
//             },
//         });

//         if (!existingAppointment) {
//             throw new AppError(httpStatus.NOT_FOUND, 'Appointment Does Not Exists.');
//         }

//         if (
//             existingAppointment.status === 'ONGOING' ||
//             existingAppointment.status === 'COMPLETED'
//         ) {
//             throw new AppError(httpStatus.CONFLICT, 'Appointment Ongoing or Completed.');
//         }

//         if (existingAppointment.status === 'CANCELLED') {
//             throw new AppError(httpStatus.CONFLICT, 'Appointment Already Cancelled.');
//         }
//=====================================end

//=====================================start
// const paymentId = query.paymentID;

//         if (!paymentId) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Payment Id Missing!');
//         }

//         const status = query.status;

//         if (!status) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Payment Status is Missing!');
//         }

//         const bkashIdToken = await getBKashIdToken();

//         if (!bkashIdToken) {
//             throw new AppError(httpStatus.BAD_GATEWAY, 'No BKash Access Token Found!');
//         }
//=====================================end

//=====================================start
// const user = req.user as unknown as IRequestUser;

//     if (!user) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'User information is missing in the request');
//     }
//=====================================end

//=====================================start
// if (!req.cookies.refreshToken) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token is missing');
//     }
//=====================================end

//=====================================start
// const isUserExists = await prisma.user.findUnique({
//         where: { email },
//     });

//     if (isUserExists) {
//         throw new AppError(httpStatus.CONFLICT, 'User with this email already exists');
//     }
//=====================================end

//=====================================start
// const isUserExists = await prisma.user.findUnique({
//         where: { email },
//     });

//     if (isUserExists?.status === 'BLOCKED') {
//         throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked!');
//     }

//     if (isUserExists?.emailVerified) {
//         throw new AppError(httpStatus.CONFLICT, 'Email ALready Verified!');
//     }

//     if (isUserExists?.isDeleted || isUserExists?.status === 'DELETED') {
//         throw new AppError(httpStatus.GONE, 'User is Deleted!');
//     }
//=====================================end

//=====================================start
// const redisOtp = await redisClient.get(otpKey);

//     if (!redisOtp) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP!');
//     }

//     if (redisOtp !== otp) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'OTP Does Not Match!');
//     }
//=====================================end

//=====================================start
// const redisPatientData = await redisClient.get(patientRegistrationKey);

//     if (!redisPatientData) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Patient Does not Exist!');
//     }
//=====================================end

//=====================================start
// const user = await prisma.user.findUnique({
//         where: { email },
//     });

//     if (!user) {
//         // throw new Error('User not found');
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     if (user.status === UserStatus.BLOCKED) {
//         throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
//     }

//     if (user.isDeleted || user.status === UserStatus.DELETED) {
//         throw new AppError(httpStatus.GONE, 'User is deleted');
//     }
//=====================================end

//=====================================start
//  const isPasswordMatched = await bcrypt.compare(
//         password,
//         user.password as string,
//     );

//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
//     }
//=====================================end

//=====================================start
// const verifiedRefreshToken = jwtUtils.verifyToken(
//         token,
//         config.jwt_refresh_secret,
//     );

//     if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
//         throw new AppError(
//             httpStatus.UNAUTHORIZED,
//             config.node_env === 'development'
//                 ? verifiedRefreshToken.error
//                 : 'Invalid refresh token',
//         );
//     }
//=====================================end

//=====================================start
// const user = await prisma.user.findUnique({
//         where: { id: data.userId },
//     });

//     if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'User is inactive or not found');
//     }
//=====================================end

//=====================================start
// const isPasswordMatched = await bcrypt.compare(
//         oldPassword,
//         user.password as string,
//     );

//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid old password');
//     }
//=====================================end

//=====================================start
// catch (error) {
//         console.log('Google ID Token Verification Failed', error);
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Or Expired Google Id Token');
//     }
//=====================================end

//=====================================start
// let googleIdTokenPayload: TokenPayload | null | undefined = null;

// if (!googleIdTokenPayload) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Or Expired Google Id Token');
//     }

//     if (!googleIdTokenPayload.email) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Google Email Not Found');
//     }
//     if (!googleIdTokenPayload.name) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Google Email User Name Not Found');
//     }
//=====================================end

//=====================================start
// const ifPatientExistWithCredentials = await prisma.user.findUnique({
//             where: {
//                 email: googleIdTokenPayload.email,
//                 role: Role.PATIENT,
//                 authProvider: AuthProvider.CREDENTIAL,
//             },
//         });

//         if (ifPatientExistWithCredentials) {
//             if (!ifPatientExistWithCredentials.emailVerified) {
//                 throw new AppError(httpStatus.BAD_REQUEST, 'Email Not Verified');
//             }

//             if (ifPatientExistWithCredentials.status === UserStatus.BLOCKED) {
//                 throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked');
//             }

//             if (
//                 ifPatientExistWithCredentials.isDeleted ||
//                 ifPatientExistWithCredentials.status === UserStatus.DELETED
//             ) {
//                 throw new AppError(httpStatus.GONE, 'User Is Deleted');
//             }
//=====================================end

//=====================================start
// if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
//     }

//     if (user.status === UserStatus.BLOCKED) {
//         throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked');
//     }

//     if (user.isDeleted || user.status === UserStatus.DELETED) {
//         throw new AppError(httpStatus.GONE, 'User Is Deleted');
//     }
//=====================================end

//=====================================start
// const isUserExist = await prisma.user.findUnique({
//         where: {
//             email,
//         },
//     });

//     if (!isUserExist) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User Does Not Exist!');
//     }

//     if (isUserExist.status === 'BLOCKED') {
//         throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked!');
//     }

//     if (!isUserExist.emailVerified) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'User Not Verified!');
//     }

//     if (isUserExist.isDeleted || isUserExist.status === 'DELETED') {
//         throw new AppError(httpStatus.GONE, 'User is Deleted!');
//     }

//     if (isUserExist.googleId && isUserExist.authProvider === 'GOOGLE') {
//         throw new AppError(httpStatus.BAD_REQUEST, 'User Has Account With Google!');
//     }
//=====================================end

//=====================================start
// const zodValidationResult = ApplyAsDoctorValidationZodSchema.safeParse(
//         JSON.parse(req.body.data),
//     );

//     if (!zodValidationResult.success) {
//         throw new AppError(httpStatus.BAD_REQUEST, zodValidationResult.error.issues[0].message);
//     }
//=====================================end

//=====================================start
// if (isUserExists) {
//         throw new AppError(httpStatus.CONFLICT, 'User Already Exists With This Email');
//     }

// if (!resume) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Resume is required');
//     }
//=====================================end

//=====================================start
// async (error, result) => {
//                         if (error) {
//                             return reject(error);
//                         }

//                         if (!result) {
//                             return reject(
//                                 new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'No result returned from Cloudinary'),
//                             );
//                         }

//                         resolve(result);
//                     },
//=====================================end

//=====================================start
// if (!existingUser) {
//         throw new AppError(
//             httpStatus.NOT_FOUND,
//             'Doctor Application Not Found. Please Apply Again.',
//         );
//     }

//     if (existingUser.emailVerified) {
//         throw new AppError(httpStatus.CONFLICT, 'Email Already Verified');
//     }
//=====================================end

//=====================================start
// const redisOtp = await redisClient.get(otpKey);

//     if (!redisOtp) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'OTP Expired. Your Application Window Has Closed, Please Apply Again.',
//         );
//     }

//     if (redisOtp !== otp) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'OTP Does Not Match');
//     }
//=====================================end

//=====================================start
//   if (!existingDoctor.user.emailVerified) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Doctor Has Not Verified Their Email Yet. Application Cannot Be Reviewed.',
//         );
//     }

//     if (
//         existingDoctor.verificationStatus !== DoctorVerificationStatus.PENDING
//     ) {
//         throw new AppError(
//             httpStatus.CONFLICT,
//             `Doctor Application Has Already Been ${existingDoctor.verificationStatus.toLowerCase()}`,
//         );
//     }

//     if (
//         verificationStatus === DoctorVerificationStatus.REJECTED &&
//         !rejectionReason
//     ) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Rejection Reason Is Required When Rejecting A Doctor Application',
//         );
//     }
//=====================================end
