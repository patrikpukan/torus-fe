import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_BY_ID_QUERY, useReportByIdQuery, } from "@/features/reports/api/useReportByIdQuery";
import { REPORTS_QUERY } from "@/features/reports/api/useReportsQuery";
import { useResolveReportMutation } from "@/features/reports/api/useResolveReportMutation";
import { useToast } from "@/hooks/use-toast";
import BanUserDialog from "@/features/users/components/BanUserDialog";

const statusLabel = (status: "pending" | "resolved") =>
  status === "resolved" ? "Resolved" : "Pending review";

const statusVariant = (status: "pending" | "resolved") =>
  status === "resolved" ? "outline" : "secondary";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "short",
});

const formatUserName = (user: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}) => {
  const parts = [user.firstName, user.lastName].filter(
    (value): value is string => Boolean(value && value.trim())
  );

  if (parts.length) {
    return parts.join(" ");
  }

  return user.email ?? "Unknown user";
};

const resolutionSchema = z.object({
  note: z.string().max(2000, "Note is too long"),
});

type ResolutionFormValues = z.infer<typeof resolutionSchema>;

const ReportDetailPage = () => {
  const params = useParams();
  const encodedId = params.id ?? "";
  const reportId = encodedId ? decodeURIComponent(encodedId) : undefined;
  const safeReportId = reportId ?? "";
  const { data, loading, error } = useReportByIdQuery(safeReportId);
  const { toast } = useToast();
  const [resolveReportMutation, { loading: resolveLoading }] =
    useResolveReportMutation();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  const resolutionForm = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionSchema),
    mode: "onChange",
    defaultValues: { note: "" },
  });

  const report = data?.reportById ?? null;
  const status = (report?.status ?? "pending") as "pending" | "resolved";
  const isResolved = status === "resolved";

  const handleResolve = useCallback(
    async (options?: { note?: string | null; silent?: boolean }) => {
      if (!reportId || isResolved) {
        return;
      }

      try {
        await resolveReportMutation({
          variables: {
            input: {
              reportId,
              resolutionNote: options?.note ?? null,
            },
          },
          refetchQueries: [
            { query: REPORT_BY_ID_QUERY, variables: { id: reportId } },
            { query: REPORTS_QUERY },
          ],
        });

        if (!options?.silent) {
          toast({
            title: "Report resolved",
            description: "The report has been marked as resolved.",
          });
        }
      } catch (mutationError) {
        toast({
          variant: "destructive",
          title: "Unable to resolve report",
          description:
            mutationError instanceof Error
              ? mutationError.message
              : "Please try again later.",
        });
      }
    },
    [isResolved, reportId, resolveReportMutation, toast]
  );

  const handleResolveSubmit = resolutionForm.handleSubmit(async (values) => {
    await handleResolve({
      note: values.note?.trim() || null,
      silent: false,
    });
    setResolveDialogOpen(false);
    resolutionForm.reset();
  });

  const handleResolveDialogChange = (next: boolean) => {
    if (!next) {
      resolutionForm.reset();
    }
    setResolveDialogOpen(next);
  };

  if (!reportId) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Report not found
        </h1>
        <p className="text-sm text-muted-foreground">
          The provided report id is invalid.
        </p>
        <Button asChild variant="secondary">
          <Link to="/reports">Back to reports</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[200px]">
        <p className="text-sm text-muted-foreground">
          Loading report detail...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Unable to load report
        </h1>
        <p className="text-sm text-destructive">{error.message}</p>
        <Button asChild variant="secondary">
          <Link to="/reports">Back to reports</Link>
        </Button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Report not available
        </h1>
        <p className="text-sm text-muted-foreground">
          It may have been removed or you no longer have access.
        </p>
        <Button asChild variant="secondary">
          <Link to="/reports">Back to reports</Link>
        </Button>
      </div>
    );
  }

  if (!report.reportedUser || !report.reporter) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Report details incomplete
        </h1>
        <p className="text-sm text-muted-foreground">
          This report is missing user information.
        </p>
        <Button asChild variant="secondary">
          <Link to="/reports">Back to reports</Link>
        </Button>
      </div>
    );
  }

  const reportedUserId = report.reportedUser.id;
  const reporterId = report.reporter.id;
  const reportedProfileHref = `/user-list/${encodeURIComponent(
    reportedUserId
  )}`;
  const reporterProfileHref = `/user-list/${encodeURIComponent(reporterId)}`;
  const reportedName = formatUserName(report.reportedUser);
  const reporterName = formatUserName(report.reporter);
  const resolvedByName = report.resolvedBy
    ? formatUserName(report.resolvedBy)
    : null;
  const resolvedAtDate = report.resolvedAt ? new Date(report.resolvedAt) : null;
  const resolveButtonLabel = resolveLoading ? "Resolving..." : "Resolve report";

  return (
    <div className="space-y-6 md:space-y-8 min-w-0">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="inline-flex items-center gap-2 text-muted-foreground"
      >
        <Link to="/reports">
          <ArrowLeft className="h-4 w-4" />
          Back to reports
        </Link>
      </Button>
      <div className="space-y-8 min-w-0">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight">
              Report detail
            </h1>
            <p className="text-sm text-muted-foreground">
              Submitted{" "}
              {report.createdAt
                ? dateFormatter.format(new Date(report.createdAt))
                : "Unknown date"}
            </p>
          </div>
          <Badge variant={statusVariant(status)} className="capitalize">
            {statusLabel(status)}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="space-y-4 rounded-lg border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Reported user
                </h2>
                <p className="mt-1 text-lg font-medium">{reportedName}</p>
                {report.reportedUser.email && (
                  <p className="break-words text-sm text-muted-foreground">
                    {report.reportedUser.email}
                  </p>
                )}
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Link to={reportedProfileHref}>
                  <Eye className="h-4 w-4" />
                  View profile
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {!isResolved && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setResolveDialogOpen(true)}
                  disabled={resolveLoading}
                >
                  {resolveButtonLabel}
                </Button>
              )}
              <BanUserDialog
                userId={reportedUserId}
                userDisplayName={reportedName}
                onCompleted={() => {
                  void handleResolve({
                    note: "Report resolved automatically after banning user",
                    silent: true,
                  });
                }}
              >
                {({ openDialog, loading }) =>
                  !isResolved && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={openDialog}
                      disabled={loading || isResolved}
                    >
                      {loading ? "Working..." : "Ban reported user"}
                    </Button>
                  )
                }
              </BanUserDialog>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Reported by
                </h2>
                <p className="mt-1 text-lg font-medium">{reporterName}</p>
                {report.reporter.email && (
                  <p className="break-words text-sm text-muted-foreground">
                    {report.reporter.email}
                  </p>
                )}
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Link to={reporterProfileHref}>
                  <Eye className="h-4 w-4" />
                  View reporter profile
                </Link>
              </Button>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Reason
          </h2>
          <p className="mt-3 whitespace-pre-line break-words text-base text-foreground">
            {report.reason}
          </p>
        </section>

        {report.resolvedBy && (
          <section className="rounded-lg border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Resolution
            </h2>
            <p className="mt-1 text-base text-foreground">
              Resolved by {resolvedByName}
            </p>
            {resolvedAtDate && (
              <p className="text-sm text-muted-foreground">
                {dateFormatter.format(resolvedAtDate)}
              </p>
            )}
            {report.resolutionNote ? (
              <p className="mt-3 whitespace-pre-line break-words text-sm text-muted-foreground">
                {report.resolutionNote}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No resolution note was provided.
              </p>
            )}
          </section>
        )}
      </div>
      <Dialog open={resolveDialogOpen} onOpenChange={handleResolveDialogChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Resolve report</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleResolveSubmit} noValidate>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Provide an optional note so other admins understand how this
                report was handled.
              </p>
              <Textarea
                placeholder="Add context for other administrators (optional)"
                {...resolutionForm.register("note")}
                disabled={resolveLoading}
                rows={4}
              />
              {resolutionForm.formState.errors.note && (
                <p className="text-sm text-destructive">
                  {resolutionForm.formState.errors.note.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleResolveDialogChange(false)}
                disabled={resolveLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resolveLoading}>
                {resolveButtonLabel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDetailPage;
