import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'selection-test-list',
        loadChildren: () => import('./selection-test-list/selection-test-list.module').then(module => module.SelectionTestListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'participant-list/:selection_test_id',
        loadChildren: () => import('./participant-list/participant-list.module').then(module => module.ParticipantListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'selection-test-questions/:selection_test_id',
        loadChildren: () => import('./selection-test-questions/selection-test-questions.module').then(module => module.SelectionTestQuestionsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'selection-test-written-questions/:selection_test_id',
        loadChildren: () => import('./selection-test-written-questions/selection-test-written-questions.module').then(module => module.SelectionTestWrittenQuestionsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course',
        loadChildren: () => import('./paid-course/paid-course.module').then(module => module.PaidCourseModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'add-paid-course',
        loadChildren: () => import('./add-paid-course/add-paid-course.module').then(module => module.AddPaidCourseModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'update-paid-course/:paid_course_id',
        loadChildren: () => import('./update-paid-course/update-paid-course.module').then(module => module.UpdatePaidCourseModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-tests/:paid_course_id',
        loadChildren: () => import('./paid-course-tests/paid-course-tests.module').then(module => module.PaidCourseTestModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-meterials-subject/:paid_course_test_id',
        loadChildren: () => import('./subject-list-paid-course-meterials/subject-list-paid-course-meterials.module').then(module => module.SubjectListPaidCourseMeterialsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-test-questions/:paid_course_test_id',
        loadChildren: () => import('./paid-course-test-questions/paid-course-test-questions.module').then(module => module.PaidCourseTestQuestionsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-subjects/:paid_course_id',
        loadChildren: () => import('./paid-course-subjects/paid-course-subjects.module').then(module => module.PaidCourseSubjectsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-mentors/:paid_course_id',
        loadChildren: () => import('./paid-course-mentors/paid-course-mentors.module').then(module => module.PaidCourseMentorsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-se-matching/:paid_course_id',
        loadChildren: () => import('./paid-course-se-matching/paid-course-se-matching.module').then(module => module.PaidCourseSEMacthingModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-results',
        loadChildren: () => import('./paid-course-results/paid-course-results.module').then(module => module.PaidCourseResultsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-quota',
        loadChildren: () => import('./paid-course-quota/paid-course-quota.module').then(module => module.PaidCourseQuotaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-marit-list',
        loadChildren: () => import('./paid-course-marit-list/paid-course-marit-list.module').then(module => module.PaidCourseMaritListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'written-result/:paid_course_result_id',
        loadChildren: () => import('./written-result/written-result.module').then(module => module.WrittenResultModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-payments',
        loadChildren: () => import('./paid-course-payments/paid-course-payments.module').then(module => module.PaidCoursePaymentsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paid-course-purchases',
        loadChildren: () => import('./paid-course-purchases/paid-course-purchases.module').then(module => module.PaidCoursePurchasesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'coupon-uses-history',
        loadChildren: () => import('./coupon-uses-history/coupon-uses-history.module').then(module => module.CouponUsesHistoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'coupon',
        loadChildren: () => import('./coupon/coupon.module').then(module => module.CouponModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/member-profile-edit/member-profile-edit.module').then(module => module.MemberProfileEditModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        loadChildren: () => import('./profile/change-password/change-password.module').then(module => module.ChangePasswordModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(module => module.AboutModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'test-participation',
        loadChildren: () => import('./test-participation/test-participation.module').then(module => module.TestParticipationModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'test-participation-list/:id',
        loadChildren: () => import('./test-participation-list/test-participation-list.module').then(module => module.TestParticipationListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'exam-participation',
        loadChildren: () => import('./exam-participation/exam-participation.module').then(module => module.ExamParticipationModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'exam-participation-list/:id',
        loadChildren: () => import('./exam-participation-list/exam-participation-list.module').then(module => module.ExamParticipationListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'spent-hours',
        loadChildren: () => import('./spent-hours/spent-hours.module').then(module => module.SpentHoursModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
  
    
      {
        path: 'video-contents-seen',
        loadChildren: () => import('./video-contents-seen/video-contents-seen.module').then(module => module.VideoContentsSeenModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'video-contents-seen-details/:id',
        loadChildren: () => import('./video-contents-seen-details/video-contents-seen-details.module').then(module => module.VideoContentsSeenDetailsModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'video-contents-spent-hour-list/:id',
        loadChildren: () => import('./video-contents-spent-hour-list/video-contents-spent-hour-list.module').then(module => module.VideoContentsSpentHourListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'test-spent-hour-list/:id',
        loadChildren: () => import('./test-spent-hour-list/test-spent-hour-list.module').then(module => module.TestSpentHourListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'exam-spent-hour-list',
        loadChildren: () => import('./exam-spent-hour-list/exam-spent-hour-list.module').then(module => module.ExamSpentHourListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'call-history-report',
        loadChildren: () => import('./call-history-report/call-history-report.module').then(module => module.CallHistoryReportModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'learner-details/:id',
        loadChildren: () => import('./learner-details/learner-details.module').then(module => module.LearnerDetailsModule),
        canActivate: [AuthGuard],
      //  data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'test-result-list/:id/:learnerId',
        loadChildren: () => import('./test-result-list/test-result-list.module').then(module => module.TestResultListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'learners-call-list-detail/:id/:phone',
        loadChildren: () => import('./learners-call-list-detail/learners-call-list-detail.module').then(module => module.LearnersCallListDetailModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin' }
      },
      {
        path: 'tutor-call-list-detail/:phone',
        loadChildren: () => import('./tutor-call-list-details/tutor-call-list-details.module').then(module => module.TutorCallListDetailModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'subject-level-audio',
        loadChildren: () => import('./subject-level-audio/subject-level-audio.module').then(module => module.SubjectLevelAudioModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'learner-list',
        loadChildren: () => import('./learner-list/learner-list.module').then(module => module.LearnerListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'device-list',
        loadChildren: () => import('./device-list/device-list.module').then(module => module.DeviceListModule),
        canActivate: [AuthGuard], 
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'videos',
        loadChildren: () => import('./videos/videos.module').then(module => module.VideosModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'script',
        loadChildren: () => import('./script/script.module').then(module => module.ScriptListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'script-spent-hour-list/:id',
        loadChildren: () => import('./script-spent-hour-list/script-spent-hour-list.module').then(module => module.ScriptSpentHourListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'small-test-list',
        loadChildren: () => import('./small-test-list/small-test-list.module').then(module => module.SmallTestListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'small-test-question-answer-list',
        loadChildren: () => import('./small-test-question-answer-list/small-test-question-answer-list.module').then(module => module.SmallTestQuestionAnswerListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'subject-level-video-small-test-list',
        loadChildren: () => import('./subject-level-video-small-test-list/subject-level-video-small-test-list.module').then(module => module.SubjectLevelVideoSmTestListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'class-video-script-list',
        loadChildren: () => import('./class-video-script-list/class-video-script-list.module').then(module => module.ClassVideoScriptListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'big-test-list',
        loadChildren: () => import('./big-test-list/big-test-list.module').then(module => module.BigTestListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'big-test-question-answer-list',
        loadChildren: () => import('./big-test-question-answer-list/big-test-question-answer-list.module').then(module => module.BigTestQuestionAnswerListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'subject-level-big-test-list',
        loadChildren: () => import('./subject-level-big-test-list/subject-level-big-test-list.module').then(module => module.SubjectLevelBigTestListModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'instruction-audios',
        loadChildren: () => import('./instruction-audios/instruction-audios.module').then(module => module.InstructionAudiosModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'most-video-seen-learners',
        loadChildren: () => import('./most-video-seen-learners/most-video-seen-learners.module').then(module => module.MostVideoSeenLearnersModule),
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'open-report',
      //   loadChildren: () => import('./open-report/open-report.module').then(module => module.OpenReportModule),
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'user-list',
        loadChildren: () => import('./user-list/user-list.module').then(module => module.UserListModule),
        canActivate: [AuthGuard],
         data: { auth: 'Super-Admin' }
      },
      {
        path: 'user-entry',
        loadChildren: () => import('./user-entry/user-entry.module').then(module => module.UserEntryModule),
        canActivate: [AuthGuard],
        data: { auth: 'Super-Admin' }
      },
      {
        path: 'area',
        loadChildren: () => import('./area/area.module').then(module => module.AreaModule),
        canActivate: [AuthGuard],
       data: { auth: 'Super-Admin' }
      },
      {
        path: 'school',
        loadChildren: () => import('./school/school.module').then(module => module.SchoolModule),
        canActivate: [AuthGuard],
       data: { auth: 'Super-Admin' }
      },
      {
        path: 'school-wise-learner',
        loadChildren: () => import('./school-wise-learner/school-wise-learner.module').then(module => module.SchoolWiseLearnerModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'school-wise-spent-hours-report',
        loadChildren: () => import('./school-wise-spent-hours-report/school-wise-spent-hours-report.module').then(module => module.SchoolWiseSpentHoursReportModule),
        canActivate: [AuthGuard],
        data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'tab-user-replace',
        loadChildren: () => import('./tab-user-replace/tab-user-replace.module').then(module => module.TabUserReplaceModule),
        canActivate: [AuthGuard],
       data: { auth: 'Super-Admin' }
      },
      {
        path: 'daily-quiz-list',
        loadChildren: () => import('./daily-quiz-list/daily-quiz-list.module').then(module => module.DailyQuizListModule),
        canActivate: [AuthGuard],
       data: { auth: 'Admin,Super-Admin' }
      },
      {
        path: 'expert-list',
        loadChildren: () => import('./expert-details/expert-details.module').then(module => module.ExpertDetailsModule),
        canActivate: [AuthGuard],
       data: { auth: 'Admin,Super-Admin' }
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
      }
    ]
  }, {
    path: '**',
    redirectTo: '/auth/signin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
