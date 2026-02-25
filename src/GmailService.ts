/**
 * Service for writing Gmail Drafts (human-in-the-loop requirement).
 * Never uses GmailApp.sendEmail().
 */
class GmailDraftService {
    /**
     * Creates a draft email in the user's Gmail connected account.
     */
    static createOutreachDraft(toAddress: string, subjectLine: string, bodyText: string): string {
        const draft = GmailApp.createDraft(toAddress, subjectLine, bodyText);
        return `https://mail.google.com/mail/u/0/#drafts?compose=${draft.getId()}`;
    }
}
