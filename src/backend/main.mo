import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";


// Extend actor with migration support

actor {
  // User profiles and roles

  public type UserProfile = {
    name : Text;
    role : AccessControl.UserRole;
    contactPreferences : Text;
    leisureCentreArea : Text;
  };

  module UserProfile {
    public func compare(userProfile1 : UserProfile, userProfile2 : UserProfile) : Order.Order {
      Text.compare(userProfile1.name, userProfile2.name);
    };
  };

  // Persist core domain data
  let userProfiles = Map.empty<Principal, UserProfile>();
  let patients = Map.empty<Principal, Patient>();
  let staff = Map.empty<Principal, StaffMember>();

  public type Patient = {
    profile : UserProfile;
    conditionSummary : Text;
    goals : Text;
    isDischarged : Bool;
  };

  public type StaffMember = {
    profile : UserProfile;
    team : Text;
    role : Text;
    caseloadCount : Nat;
  };

  let appointments = List.empty<Appointment>();
  let assessments = List.empty<Assessment>();
  let programmePlans = List.empty<ProgrammePlan>();
  let communityActivities = List.empty<CommunityActivity>();
  let noticeboardPosts = List.empty<NoticeboardPost>();

  public type Appointment = {
    patient : Principal;
    staff : Principal;
    location : Text;
    time : Time.Time;
    isConsultant : Bool;
  };

  public type Assessment = {
    patient : Principal;
    vitalObservations : Text;
    hadScore : Int;
    meamsScore : Int;
    shuttleWalkScore : Int;
    copmScore : Int;
    assessmentDate : Time.Time;
    videoRecord : ?Storage.ExternalBlob;
  };

  public type ProgrammePlan = {
    patient : Principal;
    interventions : [Text];
    frequency : Text;
    completionStatus : Bool;
  };

  public type CommunityActivity = {
    name : Text;
    location : Text;
    description : Text;
  };

  public type NoticeboardPost = {
    message : Text;
    author : Principal;
    timestamp : Time.Time;
  };

  // New types for journal and tests features
  public type JournalEntry = {
    id : Nat;
    title : ?Text;
    content : Text;
    createdAt : Time.Time;
  };

  public type TestData = {
    id : Text;
    name : Text;
    description : Text;
    questions : [Text];
  };

  public type TestProgress = {
    testId : Text;
    completed : Bool;
    answers : [Text];
  };

  // Affirmation type and storage
  public type Affirmation = {
    id : Nat;
    text : Text;
    author : ?Text;
  };

  let dailyAffirmations = List.empty<Affirmation>();

  // New persistent journal data
  let journalEntries = Map.empty<Principal, List.List<JournalEntry>>();
  var nextJournalId = 0;

  // New persistent test data and progress
  let testsAvailable = List.empty<TestData>();
  let userTestProgress = Map.empty<Principal, List.List<TestProgress>>();

  let maxTestResults = 100;

  // Access control and storage
  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // Helper function to check if caller is staff (admin role)
  func isStaff(caller : Principal) : Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin);
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or staff can view any profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Patient onboarding - authenticated users only
  public shared ({ caller }) func onboardPatient(conditionSummary : Text, goals : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can onboard as patients");
    };
    if (isStaff(caller)) {
      Runtime.trap("Unauthorized: Staff cannot onboard as patients");
    };
    let userProfile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile does not exist. Please set up your profile first.");
      };
      case (?profile) { profile };
    };
    let patient : Patient = {
      profile = userProfile;
      conditionSummary;
      goals;
      isDischarged = false;
    };
    patients.add(caller, patient);
  };

  // Book appointment - patients can book their own, staff can book for any patient
  public shared ({ caller }) func bookAppointment(patientPrincipal : Principal, staff : Principal, location : Text, time : Time.Time, isConsultant : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can book appointments");
    };
    if (caller != patientPrincipal and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Patients can only book their own appointments");
    };
    let appointment : Appointment = {
      patient = patientPrincipal;
      staff;
      location;
      time;
      isConsultant;
    };
    appointments.add(appointment);
  };

  // Add assessment - staff only
  public shared ({ caller }) func addAssessment(patient : Principal, vitalObservations : Text, hadScore : Int, meamsScore : Int, shuttleWalkScore : Int, copmScore : Int, assessmentDate : Time.Time, videoRecord : ?Storage.ExternalBlob) : async () {
    if (not isStaff(caller)) {
      Runtime.trap("Unauthorized: Only staff can add assessments");
    };
    let assessment : Assessment = {
      patient;
      vitalObservations;
      hadScore;
      meamsScore;
      shuttleWalkScore;
      copmScore;
      assessmentDate;
      videoRecord;
    };
    assessments.add(assessment);
  };

  // Create programme plan - staff only
  public shared ({ caller }) func createProgrammePlan(patient : Principal, interventions : [Text], frequency : Text) : async () {
    if (not isStaff(caller)) {
      Runtime.trap("Unauthorized: Only staff can create programme plans");
    };
    let programmePlan : ProgrammePlan = {
      patient;
      interventions;
      frequency;
      completionStatus = false;
    };
    programmePlans.add(programmePlan);
  };

  // Get all appointments for a patient - patient can view own, staff can view any
  public query ({ caller }) func getAppointmentsForPatient(patient : Principal) : async [Appointment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view appointments");
    };
    if (caller != patient and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Can only access your own appointments or staff can access any");
    };
    appointments.toArray().filter(func(appointment) { appointment.patient == patient });
  };

  // Update completion status for a programme plan - patient can update own, staff can update any
  public shared ({ caller }) func updateProgrammePlanStatus(patient : Principal, isCompleted : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update programme plans");
    };
    if (caller != patient and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Can only update your own programme plan or staff can update any");
    };

    let lastPlan = programmePlans.reverse().filter(func(p) { p.patient == patient }).values().next();
    switch (lastPlan) {
      case (null) {
        Runtime.trap("No programme plan found for the given patient");
      };
      case (?plan) {
        let updatedProgrammePlan : ProgrammePlan = {
          patient = patient;
          interventions = plan.interventions;
          frequency = plan.frequency;
          completionStatus = isCompleted;
        };
        let remainingPlans = programmePlans.filter(func(p) { p.patient != patient });
        programmePlans.clear();
        programmePlans.add(updatedProgrammePlan);
        programmePlans.addAll(remainingPlans.values());
      };
    };
  };

  // Add community activity - staff only
  public shared ({ caller }) func addCommunityActivity(name : Text, location : Text, description : Text) : async () {
    if (not isStaff(caller)) {
      Runtime.trap("Unauthorized: Only staff can add community activities");
    };
    let communityActivity : CommunityActivity = {
      name;
      location;
      description;
    };
    communityActivities.add(communityActivity);
  };

  // Add noticeboard post - authenticated users
  public shared ({ caller }) func addNoticeboardPost(message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can post to the noticeboard");
    };
    let noticeboardPost : NoticeboardPost = {
      message;
      author = caller;
      timestamp = Time.now();
    };
    noticeboardPosts.add(noticeboardPost);
  };

  // Discharge patient and delete video - staff only
  public shared ({ caller }) func dischargePatient(patientPrincipal : Principal) : async () {
    if (not isStaff(caller)) {
      Runtime.trap("Unauthorized: Only staff can discharge patients");
    };
    let patientData = switch (patients.get(patientPrincipal)) {
      case (null) {
        Runtime.trap("No patient found with the given principal");
      };
      case (?patient) { patient };
    };
    patients.add(
      patientPrincipal,
      {
        profile = patientData.profile;
        conditionSummary = patientData.conditionSummary;
        goals = patientData.goals;
        isDischarged = true;
      },
    );
    let patientAssessments = assessments.filter(
      func(a) { a.patient == patientPrincipal }
    );
    let otherAssessments = assessments.filter(
      func(a) { a.patient != patientPrincipal }
    );
    assessments.clear();
    for (assessment in patientAssessments.values()) {
      let clearedAssessment : Assessment = {
        patient = assessment.patient;
        vitalObservations = assessment.vitalObservations;
        hadScore = assessment.hadScore;
        meamsScore = assessment.meamsScore;
        shuttleWalkScore = assessment.shuttleWalkScore;
        copmScore = assessment.copmScore;
        assessmentDate = assessment.assessmentDate;
        videoRecord = null;
      };
      assessments.add(clearedAssessment);
    };
    assessments.addAll(otherAssessments.values());
  };

  // Retrieve all community activities
  public query ({ caller }) func getAllCommunityActivities() : async [CommunityActivity] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view community activities");
    };
    communityActivities.toArray();
  };

  // Retrieve all noticeboard posts
  public query ({ caller }) func getAllNoticeboardPosts() : async [NoticeboardPost] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view noticeboard posts");
    };
    noticeboardPosts.toArray();
  };

  // Retrieve all users sorted by name - staff only
  public query ({ caller }) func getAllUsersSortedByName() : async [UserProfile] {
    if (not isStaff(caller)) {
      Runtime.trap("Unauthorized: Only staff can view all users");
    };
    userProfiles.values().toArray().sort();
  };

  // Get patient data - patient can view own, staff can view any
  public query ({ caller }) func getPatient(patientPrincipal : Principal) : async ?Patient {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view patient data");
    };
    if (caller != patientPrincipal and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Can only view your own patient data or staff can view any");
    };
    patients.get(patientPrincipal);
  };

  // Get assessments for patient
  public query ({ caller }) func getAssessmentsForPatient(patient : Principal) : async [Assessment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view assessments");
    };
    if (caller != patient and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Can only view your own assessments or staff can view any");
    };
    assessments.toArray().filter(func(assessment) { assessment.patient == patient });
  };

  // Get programme plans for patient
  public query ({ caller }) func getProgrammePlansForPatient(patient : Principal) : async [ProgrammePlan] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view programme plans");
    };
    if (caller != patient and not isStaff(caller)) {
      Runtime.trap("Unauthorized: Can only view your own programme plans or staff can view any");
    };
    programmePlans.toArray().filter(func(plan) { plan.patient == patient });
  };

  // New functionality for self-care extension

  // Journal Feature - authenticated users only

  // Create a new journal entry (authenticated users only)
  public shared ({ caller }) func createJournalEntry(title : ?Text, content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create journal entries");
    };
    let entry : JournalEntry = {
      id = nextJournalId;
      title;
      content;
      createdAt = Time.now();
    };
    let existingEntries = switch (journalEntries.get(caller)) {
      case (null) { List.empty<JournalEntry>() };
      case (?entries) { entries };
    };
    existingEntries.add(entry);
    journalEntries.add(caller, existingEntries);
    nextJournalId += 1;
    entry.id;
  };

  // Get all journal entries for the caller (sorted newest first)
  public query ({ caller }) func getAllJournalEntries() : async [JournalEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view journal entries");
    };
    let entries = switch (journalEntries.get(caller)) {
      case (null) { List.empty<JournalEntry>() };
      case (?entries) { entries };
    };
    entries.toArray();
  };

  // Delete a specific journal entry by ID
  public shared ({ caller }) func deleteJournalEntry(entryId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can delete journal entries");
    };
    let entries = switch (journalEntries.get(caller)) {
      case (null) { List.empty<JournalEntry>() };
      case (?entries) { entries };
    };
    let filteredEntries = entries.filter(func(e) { e.id != entryId });
    journalEntries.add(caller, filteredEntries);
  };

  // Get a single journal entry by ID
  public query ({ caller }) func getJournalEntry(entryId : Nat) : async ?JournalEntry {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view journal entries");
    };
    let entries = switch (journalEntries.get(caller)) {
      case (null) { List.empty<JournalEntry>() };
      case (?entries) { entries };
    };
    entries.toArray().find(func(e) { e.id == entryId });
  };

  // Tests/Quizzes Feature - authenticated users only

  // Initialize tests with the system
  public shared ({ caller }) func addTest(test : TestData) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add tests");
    };
    testsAvailable.add(test);
  };

  // Get all available tests (authenticated users)
  public query ({ caller }) func getAllTests() : async [TestData] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view tests");
    };
    testsAvailable.toArray();
  };

  // Start or continue a test and track user progress
  public shared ({ caller }) func startTest(testId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can start tests");
    };
    let test = switch (testsAvailable.toArray().find(func(t) { t.id == testId })) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) { test };
    };

    let existingProgress = switch (userTestProgress.get(caller)) {
      case (null) { List.empty<TestProgress>() };
      case (?progress) { progress };
    };

    if (existingProgress.toArray().find(func(p) { p.testId == testId }) != null) {
      Runtime.trap("Test already started. Please continue from your existing progress.");
    };

    var removedLast : [TestProgress] = [];
    let currentProgressLength = existingProgress.size();

    if (currentProgressLength >= maxTestResults) {
      let progressArray = existingProgress.toArray();
      if (progressArray.size() > 0) {
        removedLast := Array.tabulate(
          currentProgressLength - 1,
          func(i) { progressArray[i] },
        );
        existingProgress.clear();
        existingProgress.addAll(removedLast.values());
      };
    };
    let newProgress : TestProgress = {
      testId;
      completed = false;
      answers = [];
    };
    existingProgress.add(newProgress);
    userTestProgress.add(caller, existingProgress);
  };

  // Complete a test and submit answers
  public shared ({ caller }) func completeTest(testId : Text, answers : [Text]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can complete tests");
    };

    let test = switch (testsAvailable.toArray().find(func(t) { t.id == testId })) {
      case (null) { Runtime.trap("Test not found") };
      case (?t) { t };
    };

    if (test.questions.size() != answers.size()) {
      Runtime.trap("Number of answers does not match number of questions");
    };

    let existingProgress = switch (userTestProgress.get(caller)) {
      case (null) { List.empty<TestProgress>() };
      case (?progress) { progress };
    };

    let testProgressArray = existingProgress.toArray();

    let progressIndex = testProgressArray.findIndex(func(p) { p.testId == testId });

    switch (progressIndex) {
      case (null) { Runtime.trap("Test not started. Please start the test first.") };
      case (?index) {
        let updatedTestProgress : TestProgress = {
          testId;
          completed = true;
          answers;
        };

        let updatedProgress = Array.tabulate(
          testProgressArray.size(),
          func(i) { if (i == index) { updatedTestProgress } else { testProgressArray[i] } },
        );

        existingProgress.clear();
        existingProgress.addAll(updatedProgress.values());
        userTestProgress.add(caller, existingProgress);
      };
    };
  };

  // Get test progress for the current user
  public query ({ caller }) func getUserTestProgress() : async [TestProgress] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view test progress");
    };
    switch (userTestProgress.get(caller)) {
      case (null) { [] };
      case (?progress) { progress.toArray() };
    };
  };

  // Daily Affirmation - accessible to all users including guests

  // Add a new affirmation (admin only)
  public shared ({ caller }) func addAffirmation(text : Text, author : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add affirmations");
    };
    let affirmation : Affirmation = {
      id = dailyAffirmations.size();
      text;
      author;
    };
    dailyAffirmations.add(affirmation);
  };

  // Get a random daily affirmation - accessible to all users including guests
  public query ({ caller }) func getRandomAffirmation() : async ?Affirmation {
    // No authorization check - accessible to all users including guests
    let affirmationsArray = dailyAffirmations.toArray();
    if (affirmationsArray.size() == 0) { return null };
    let timestamp = Time.now();
    let seed = (timestamp % affirmationsArray.size().toInt()).toNat();
    ?affirmationsArray[seed];
  };

  // Growth feature - authenticated users only

  public query ({ caller }) func getUserGrowthSummary() : async {
    journalCount : Nat;
    completedTests : Nat;
    streak : Nat;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view growth summary");
    };

    let journalEntriesCount = switch (journalEntries.get(caller)) {
      case (null) { 0 };
      case (?entries) { entries.size() };
    };

    let completedTestsCount = switch (userTestProgress.get(caller)) {
      case (null) { 0 };
      case (?progress) {
        let completed = progress.toArray().filter(func(p) { p.completed });
        completed.size();
      };
    };

    // Calculate streak
    let entries = switch (journalEntries.get(caller)) {
      case (null) { List.empty<JournalEntry>() };
      case (?entries) { entries };
    };
    let streakCount = calculateStreak(entries);
    {
      journalCount = journalEntriesCount;
      completedTests = completedTestsCount;
      streak = streakCount;
    };
  };

  // Helper to calculate journal streak
  func calculateStreak(entries : List.List<JournalEntry>) : Nat {
    let entriesArray = entries.toArray();
    var streak = 0;
    var currentTime = Time.now();

    let dayLength = 86_400_000_000_000;
    var dayCounter = 0;

    for (i in entriesArray.keys()) {
      let entry = entriesArray[i];
      let dayDiff = (currentTime - entry.createdAt) / dayLength.toInt();
      if (dayDiff == dayCounter) {
        streak += 1;
        dayCounter += 1;
      };
    };
    streak;
  };
};
