function isMeetingWithinWorkingHours(workStart, workEnd, meetingStart, meetingDuration) {

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const workStartMinutes = timeToMinutes(workStart);
  const workEndMinutes = timeToMinutes(workEnd);
  const meetingStartMinutes = timeToMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;

  if (meetingStartMinutes < workStartMinutes || meetingEndMinutes > workEndMinutes) {
    return false;
  }

  if (workStartMinutes > workEndMinutes) {
    return false;
  }

  return true;
}
