import z from "zod";

const formatSchema = z.object({
    email: z.string().email().max(40).toLowerCase(),
    password: z.string().min(8, { message: "Password ust be 8 or more characters long" }).max(20, { message: "Password must be 20 or fewer characters long" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"}),
    name: z.string().min(3, { message: "Name must be 3 or more characters long" }).max(20, { message: "Name must be 20 or fewer characters long" }).optional(),
})

function format(req, res, next) {
    try {
        const parsed_body = formatSchema.safeParse(req.body);
        
        if (!parsed_body.success) {
            const errorMessages = parsed_body.error.issues.map(issue => issue.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errorMessages
            });
        }
        next();
    } catch (error) {
        console.error('Validation middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during validation"
        });
    }
}

export default format;