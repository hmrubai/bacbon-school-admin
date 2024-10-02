import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  permission?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard',
    classes: 'nav-item',
    icon: 'feather icon-home'
  },
 
  {
    id: 'selection-test',
    title: 'Selection Test', 
    type: 'item',
    url: '/selection-test-list',
    classes: 'nav-item',
    icon: 'fa fa-check-circle',
    //permission: 'Admin,Super-Admin',
  },
  // {
  //   id: 'paid-course',
  //   title: 'Paid Course',
  //   type: 'item',
  //   url: '/paid-course',
  //   classes: 'nav-item',
  //   icon: 'fa fa-book',
  //   //permission: 'Admin,Super-Admin',
  // },
  // {
  //   id: 'coupon',
  //   title: 'Coupon',
  //   type: 'item',
  //   url: '/coupon',
  //   classes: 'nav-item',
  //   icon: 'fas fa-percent',
  //   //permission: 'Admin,Super-Admin',
  // },

  {
    id: 'daily-quiz-list',
    title: 'Daily Quiz',
    type: 'collapse',
    icon: 'fa fa-book',
   //permission: 'Admin,Super-Admin',
    children: [
      {
        id: 'daily-quiz-list',
        title: 'Daily Quiz List',
        type: 'item',
        url: '/daily-quiz-list',
        classes: 'nav-item',
        icon: 'fa fa-book',
        //permission: 'MasterSettings'
      },
      // {
      //   id: 'paid-course-quota',
      //   title: 'Paid Course Quota',
      //   type: 'item',
      //   url: '/paid-course-quota',
      //   classes: 'nav-item',
      //   icon: 'fas fa-file-alt',
      //   //permission: 'MasterSettings'
      // },
    
    ]
  },
  {
    id: 'paid-course',
    title: 'Paid Course',
    type: 'collapse',
    icon: 'fa fa-certificate',
   //permission: 'Admin,Super-Admin',
    children: [
      {
        id: 'paid-course',
        title: 'Paid Course',
        type: 'item',
        url: '/paid-course',
        classes: 'nav-item',
        icon: 'fa fa-book',
        //permission: 'MasterSettings'
      },
      {
        id: 'paid-course-quota',
        title: 'Paid Course Quota',
        type: 'item',
        url: '/paid-course-quota',
        classes: 'nav-item',
        icon: 'fas fa-file-alt',
        //permission: 'MasterSettings'
      },
    
    ]
  },
  {
    id: 'coupon',
    title: 'Coupon',
    type: 'collapse',
    icon: 'fa fa-file-alt',
   //permission: 'Admin,Super-Admin',
    children: [
      {
        id: 'coupon',
        title: 'Coupon',
        type: 'item',
        url: '/coupon',
        classes: 'nav-item',
        icon: 'fas fa-percent',
        //permission: 'MasterSettings'
      },
      {
        id: 'coupon-uses-history',
        title: 'Coupon Uses History',
        type: 'item',
        url: '/coupon-uses-history',
        classes: 'nav-item',
        icon: 'fas fa-file-alt',
        //permission: 'MasterSettings'
      },
    
    ]
  },
  {
    id: 'life-couch',
    title: 'Life Coach',
    type: 'collapse',
    icon: 'fa fa-headphones',
   //permission: 'Admin,Super-Admin',
    children: [
      {
        id: 'expert',
        title: 'Expert',
        type: 'item',
        url: '/expert-list',
        classes: 'nav-item',
        icon: 'fas fa-users',
        //permission: 'MasterSettings'
      },
      {
        id: 'paid-course-completed-class',
        title: 'LC Completed Class',
        type: 'item',
        url: '/paid-course-completed-class',
        classes: 'nav-item',
        icon: 'fas fa-list',
        //permission: 'MasterSettings'
      },
      // {
      //   id: 'student-mappting',
      //   title: 'Student Matching',
      //   type: 'item',
      //   url: '/coupon-uses-history',
      //   classes: 'nav-item',
      //   icon: 'fas fa-user-circle',
      //   //permission: 'MasterSettings'
      // },
    
    ]
  },
  // {
  //   id: 'paid-course-payments',
  //   title: 'Paid Course Payments',
  //   type: 'item',
  //   url: '/paid-course-payments',
  //   classes: 'nav-item',
  //   icon: 'fas fa-money-check-alt',
  //   //permission: 'Admin,Super-Admin',
  // },
  // {
  //   id: 'paid-course-purchases',
  //   title: 'Paid Course Purchases',
  //   type: 'item',
  //   url: '/paid-course-purchases',
  //   classes: 'nav-item',
  //   icon: 'fas fa-file-alt',
  //   //permission: 'Admin,Super-Admin',
  // },
  // {
  //   id: 'coupon-uses-history',
  //   title: 'Coupon Uses History',
  //   type: 'item',
  //   url: '/coupon-uses-history',
  //   classes: 'nav-item',
  //   icon: 'fas fa-file-alt',
  //   //permission: 'Admin,Super-Admin',
  // },
  // {
  //   id: 'paid-course-results',
  //   title: 'Results',
  //   type: 'item',
  //   url: '/paid-course-results',
  //   classes: 'nav-item',
  //   icon: 'fas fa-file-alt',
  //   //permission: 'Admin,Super-Admin',
  // },
  {
    id: 'paid-course-results',
    title: 'Report',
    type: 'collapse',
    icon: 'fa fa-file-alt',
   //permission: 'Admin,Super-Admin',
    children: [
      {
        id: 'paid-course-payments',
        title: 'Paid Course Payments',
        type: 'item',
        url: '/paid-course-payments',
        classes: 'nav-item',
        icon: 'fas fa-money-check-alt',
        //permission: 'MasterSettings'
      },
      {
        id: 'paid-course-purchases',
        title: 'Paid Course Purchases',
        type: 'item',
        url: '/paid-course-purchases',
        classes: 'nav-item',
        icon: 'fas fa-file-alt',
        //permission: 'MasterSettings'
      },
      {
        id: 'paid-course-results',
        title: 'See Result',
        type: 'item',
        url: '/paid-course-results',
        classes: 'nav-item',
        icon: 'fa fa-file-alt',
        //permission: 'MasterSettings'
      },
      {
        id: 'paid-course-marit-list',
        title: 'See Merit List',
        type: 'item',
        url: '/paid-course-marit-list',
        classes: 'nav-item',
        icon: 'fa fa-file-alt',
        //permission: 'MasterSettings'
      },
    
    ]
  },
  // {
  //   id: 'report',
  //   title: 'Reports',
  //   type: 'collapse',
  //   icon: 'fa fa-file',
  //  permission: 'Admin,Super-Admin',
  //   children: [
  //     // {
  //     //   id: 'most-video-seen-learners',
  //     //   title: 'Most Video Seen Learners',
  //     //   type: 'item',
  //     //   url: '/most-video-seen-learners',
  //     //   classes: 'nav-item',
  //     //   icon: 'fa fa-file',
  //     //  // permission: 'TrackingSchedule'
  //     // },
  //     // {
  //     //   id: 'open-report',
  //     //   title: 'Open Report',
  //     //   type: 'item',
  //     //   url: '/open-report',
  //     //   classes: 'nav-item',
  //     //   icon: 'fa fa-file',
  //     //  // permission: 'TrackingSchedule'
  //     // },
  //     {
  //         id: 'School-wise-learner',
  //         title: 'School Wise Learners',
  //         type: 'item',
  //         url: '/school-wise-learner',
  //         classes: 'nav-item',
  //         icon: 'fa fa-file',
  //      },
  //     {
  //         id: 'school-wise-spent-hours-report',
  //         title: 'School Wise Spent Hours',
  //         type: 'item',
  //         url: '/school-wise-spent-hours-report',
  //         classes: 'nav-item',
  //         icon: 'fa fa-file',
  //      },

  //   ]
  // },
  {
    id: 'settings',
    title: 'Master Settings',
    type: 'collapse',
    icon: 'fa fa-toolbox',
    permission: 'Super-Admin',
    children: [
      // {
      //   id: 'subject-level-audio',
      //   title: 'Subject Chapter Audio',
      //   type: 'item',
      //   url: '/subject-level-audio',
      //   classes: 'nav-item',
      //   icon: 'fa fa-file-audio',

      //   //permission: 'MasterSettings'
      // },
      {
        id: 'device-list',
        title: 'Devices',
        type: 'item',
        url: '/device-list',
        classes: 'nav-item',
        icon: 'fa fa-desktop',
        // permission: 'MasterSettings'
      },
      {
        id: 'area',
        title: 'Areas',
        type: 'item',
        url: '/area',
        classes: 'nav-item',
        icon: 'fa fa-map-marker ',
       
      },
      {
        id: 'school',
        title: 'Schools',
        type: 'item',
        url: '/school',
        classes: 'nav-item',
        icon: 'fa fa-graduation-cap ',
        
      },
      {
        id: 'videos',
        title: 'Videos',
        type: 'item',
        url: '/videos',
        classes: 'nav-item',
        icon: 'fa fa-file-video',
        // permission: 'MasterSettings'
      },
      {
        id: 'script',
        title: 'Scripts',
        type: 'item',
        url: '/script',
        classes: 'nav-item',
        icon: 'fa fa-file',
        // permission: 'MasterSettings'
      },
      {
        id: 'small-test-list',
        title: 'Small Tests ',
        type: 'item',
        url: '/small-test-list',
        classes: 'nav-item',
        icon: 'fa fa-file',
        //permission: 'MasterSettings'
      },
      {
        id: 'small-test-question-answer-list',
        title: 'Small Test QA',
        type: 'item',
        url: '/small-test-question-answer-list',
        classes: 'nav-item',
        icon: 'fa fa-book',
        //permission: 'MasterSettings'
      },
      {
        id: 'subject-level-video-small-test-list',
        title: 'Video Small Tests',
        type: 'item',
        url: '/subject-level-video-small-test-list',
        classes: 'nav-item',
        icon: 'fa fa-file',
        //permission: 'MasterSettings'
      },
      {
        id: 'class-video-script-list',
        title: 'Video Scripts List',
        type: 'item',
        url: '/class-video-script-list',
        classes: 'nav-item',
        icon: 'fa fa-file',
        //permission: 'MasterSettings'
      },
      {
        id: 'tab-user-replace',
        title: 'Tab User Replace',
        type: 'item',
        url: '/tab-user-replace',
        classes: 'nav-item',
        icon: 'fa fa-file',
        //permission: 'MasterSettings'
      },
      // {
      //   id: 'big-test-list',
      //   title: 'Big Test ',
      //   type: 'item',
      //   url: '/big-test-list',
      //   classes: 'nav-item',
      //   icon: 'fa fa-file',
      //   //permission: 'MasterSettings'
      // },
      // {
      //   id: 'big-test-question-answer-list',
      //   title: 'Big Test QA',
      //   type: 'item',
      //   url: '/big-test-question-answer-list',
      //   classes: 'nav-item',
      //   icon: 'fa fa-file',
      //   //permission: 'MasterSettings'
      // },
      // {
      //   id: 'subject-level-big-test-list',
      //   title: 'Sub Chapter Big Test',
      //   type: 'item',
      //   url: '/subject-level-big-test-list',
      //   classes: 'nav-item',
      //   icon: 'fa fa-file',
      //   //permission: 'MasterSettings'
      // },
      // {
      //   id: 'instruction-audios',
      //   title: 'Instruction Audios',
      //   type: 'item',
      //   url: '/instruction-audios',
      //   classes: 'nav-item',
      //   icon: 'fa fa-file-audio',
      //   //permission: 'MasterSettings'
      // },

    ]
  },
  {
    id: 'user-list',
    title: 'Users',
    type: 'item',
    url: '/user-list',
    classes: 'nav-item',
    icon: 'fa fa-users',
   permission: 'Super-Admin'
  },
  // {
  //   id: 'about',
  //   title: 'About',
  //   type: 'item',
  //   url: '/about',
  //   classes: 'nav-item',
  //   icon: 'fa fa-info-circle',
  //  // permission: 'Admin,Super-Admin',
  // },
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
