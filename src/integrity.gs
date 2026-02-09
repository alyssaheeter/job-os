function integrityCheck() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return;
  }
  try {
    createMissingSheets();
    logEvent("INFO", "integrity_check", "", "", { status: "ok" });
  } catch (err) {
    logEvent("ERROR", "integrity_error", "", "", { error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
