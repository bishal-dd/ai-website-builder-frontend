"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Save, Loader2 } from "lucide-react";
import { useProfileLogic } from "./hooks/useProfile";

export default function ProfilePage() {
  const { user, form, hasProfileChanges, onProfileUpdate, onPasswordUpdate } =
    useProfileLogic();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="mb-8 flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage
              src={user?.image || "/placeholder.svg"}
              alt={user?.name}
            />
            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background shadow-md"
            disabled
            title="Avatar upload coming soon"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="inline-flex w-full rounded-full bg-muted p-1">
          <TabsTrigger
            value="general"
            className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your personal info</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onProfileUpdate)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !hasProfileChanges}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a strong password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onPasswordUpdate)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword")}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
