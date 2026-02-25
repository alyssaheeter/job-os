/**
 * Automates creating standard nested Drive folders.
 * Goal: /JobHunt_OS/02_Companies/{Company}/{Role}/...
 */
class DriveScaffoldService {

    /**
     * Fetches or creates a folder by name inside a parent.
     */
    static getOrCreateFolder(parentFolderId: string, folderName: string): string {
        const parentFolder = DriveApp.getFolderById(parentFolderId);
        const iterator = parentFolder.getFoldersByName(folderName);

        if (iterator.hasNext()) {
            return iterator.next().getId();
        }

        const newFolder = parentFolder.createFolder(folderName);
        return newFolder.getId();
    }

    /**
     * Scaffolds exactly the targeted folder structure for a given opportunity.
     */
    static createOpportunityFolders(systemRootFolderId: string, company: string, role: string): { companyFolderId: string, roleFolderId: string } {
        // Navigate / create "02_Companies"
        const companiesFolderId = this.getOrCreateFolder(systemRootFolderId, "02_Companies");

        // Navigate / create {Company}
        // Sanitize folder names
        const safeCompany = company.replace(/[^a-zA-Z0-9 -]/g, "").trim();
        const safeRole = role.replace(/[^a-zA-Z0-9 -]/g, "").trim();

        const companyFolderId = this.getOrCreateFolder(companiesFolderId, safeCompany);

        // Navigate / create {Role} based on Company
        const roleFolderId = this.getOrCreateFolder(companyFolderId, safeRole);

        // Scaffold substructure inside {Role} path
        this.getOrCreateFolder(roleFolderId, "01_Job_Posting");
        this.getOrCreateFolder(roleFolderId, "02_Resume_Drafts");
        this.getOrCreateFolder(roleFolderId, "03_Cover_Letter_Drafts");
        this.getOrCreateFolder(roleFolderId, "04_Outreach_Drafts");
        this.getOrCreateFolder(roleFolderId, "05_Interview_Prep");

        return { companyFolderId, roleFolderId };
    }
}
