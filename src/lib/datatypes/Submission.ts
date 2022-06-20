type SubmissionType = 'new' | 'edit' | 'report';

export interface Submission extends SubmissionPublic{
   Submission_content: string; // JSON.stringify
	Submission_relations: string; // JSON.stringify
	id: string;
	Submission_comment: string;
   Submission_user_ID: string,
}

export interface SubmissionPublic {
   Submission_type: SubmissionType;
	Submission_page_type: string;
   Submission_page_ID: number;
	Submission_username: string;
   Submission_date: Date;
   Submission_status: string;
   Submission_Roles: string // JSON.stringify
}
