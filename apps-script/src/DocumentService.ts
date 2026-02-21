/**
 * Service for Google Docs creation and targeting.
 */
class DocumentService {
    /**
     * Creates a Google Doc, sets text, and moves it to the appropriate Drive folder.
     */
    static createDraftDocument(parentFolderId: string, title: string, bodyText: string): string {
        const doc = DocumentApp.create(title);
        doc.getBody().setText(bodyText);
        const fileId = doc.getId();

        // Move to the target Drive folder from the root
        const file = DriveApp.getFileById(fileId);

        try {
            // In newer Apps Script Drive API versions, moveTo() is standard
            const targetFolder = DriveApp.getFolderById(parentFolderId);
            file.moveTo(targetFolder);
        } catch (e) {
            // Fallback for older V8 runtime syntax
            const targetFolder = DriveApp.getFolderById(parentFolderId);
            targetFolder.addFile(file);
            DriveApp.getRootFolder().removeFile(file);
        }

        return doc.getUrl();
    }
}
