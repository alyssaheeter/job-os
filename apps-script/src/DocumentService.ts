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
        return this.moveFile(doc.getId(), parentFolderId);
    }

    /**
     * Copies a Template Google Doc, runs text replacements, and moves it to the appropiate Drive folder.
     */
    static createFromTemplate(parentFolderId: string, title: string, templateId: string, tokens: Record<string, string>): string {
        const templateFile = DriveApp.getFileById(templateId);
        const newFile = templateFile.makeCopy(title);

        const doc = DocumentApp.openById(newFile.getId());
        const body = doc.getBody();

        for (const [key, value] of Object.entries(tokens)) {
            body.replaceText(`\\{\\{${key}\\}\\}`, value);
        }

        doc.saveAndClose();
        return this.moveFile(newFile.getId(), parentFolderId);
    }

    private static moveFile(fileId: string, parentFolderId: string): string {
        const file = DriveApp.getFileById(fileId);
        try {
            const targetFolder = DriveApp.getFolderById(parentFolderId);
            file.moveTo(targetFolder);
        } catch (e) {
            const targetFolder = DriveApp.getFolderById(parentFolderId);
            targetFolder.addFile(file);
            DriveApp.getRootFolder().removeFile(file);
        }
        return file.getUrl();
    }
}
